from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional
import secrets
from fastapi import APIRouter, HTTPException, Depends,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from dependencies.db import get_db  # Import your database session dependency
from dependencies.models import User, FamilyGroup, FamilyMember, Location, LiveLocation, PastTrip # Import the SQLAlchemy User model
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr, model_validator
from datetime import datetime
from typing import Optional
from enum import Enum
import qrcode,os
from sqlalchemy.orm import selectinload
from fastapi.responses import JSONResponse
from utlis.sos import send_sms
from sqlalchemy.exc import SQLAlchemyError

# Enum for Gender
class Gender(str, Enum):
    male = "Male"
    female = "Female"
    other = "Other"

# Updated Pydantic model for creating a user
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password_hash: str
    dob: Optional[datetime] = None  # Date of birth
    gender: Optional[Gender] = None  # User's gender
    is_disabled: Optional[bool] = False  # Whether the user has a disability
    disability_type: Optional[str] = None  # Type of disability (if applicable)
    pfp: Optional[str] = None  # Profile picture URL or file path (optional)

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy models


# Updated Pydantic model for updating a user
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password_hash: Optional[str] = None
    dob: Optional[datetime] = None  # Date of birth
    gender: Optional[Gender] = None  # User's gender
    is_disabled: Optional[bool] = None  # Whether the user has a disability
    disability_type: Optional[str] = None  # Type of disability (if applicable)
    pfp: Optional[str] = None  # Profile picture URL or file path (optional)

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy models


# Updated Pydantic model for returning a user
class UserResponse(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    created_at: datetime
    dob: Optional[datetime] = None  # Date of birth
    gender: Optional[Gender] = None  # User's gender
    age:Optional[int]=None
    is_disabled: bool
    disability_type: Optional[str] = None  # Type of disability (if applicable)
    pfp: Optional[str] = None  # Profile picture URL or file path

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy models

      
# Pydantic model for creating a family group
class FamilyGroupCreate(BaseModel):
    group_name: str
    created_by: int  # User ID of the creator

# Pydantic model for joining a family group
class FamilyGroupJoin(BaseModel):
    join_code: str  # Unique code to join the family group
    user_id: int    # User ID of the user joining the group

# Pydantic model for returning a family group
class FamilyGroupResponse(BaseModel):
    group_id: int
    group_name: str
    join_code: str
    created_by: int
    created_at: datetime

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy models

# Pydantic model for returning a family member
class FamilyMemberResponse(BaseModel):
    group_id: int
    user_id: int
    added_at: datetime
    gender:str
    dob:str
    name:str
    pfp:Optional[str]=None
    location:Optional[str]=None

    class Config:
        orm_mode = True  # Enable ORM mode for SQLAlchemy models
        
       
class FamilyGroupUpdate(BaseModel):
    current_user_id: int  # Current user's ID
    group_name: str       # New group name
    
class LocationCreate(BaseModel):
    user_id: int
    location_name: str
    #place_name: str
    latitude: float
    longitude: float

app = APIRouter()

@app.post("/create_user/", response_model=UserResponse)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if the email or phone already exists
    existing_user = await db.execute(select(User).filter((User.email == user.email) | (User.phone == user.phone)))
    if existing_user.scalar():
        raise HTTPException(status_code=400, detail="Email or phone already registered")

    # Create a new user instance using the SQLAlchemy User model
    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password_hash=user.password_hash,
        dob=user.dob,
        gender=user.gender,
        is_disabled=user.is_disabled,
        disability_type=user.disability_type,
        pfp=user.pfp,
    )

    # Add and commit the new user to the database
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user



@app.get("/users/{user_id}")
async def read_user(user_id: int, db: AsyncSession = Depends(get_db)):
    # Get the user details along with associated family member in one query
    result = await db.execute(
        select(User)
        .options(selectinload(User.family_memberships))  # Eager load related FamilyMember
        .filter(User.user_id == user_id)
    )
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Extract group_id from the family member relationships
    group_id = None
    if user.family_memberships:
        group_id = user.family_memberships[0].group_id

    # Prepare the response using the UserResponse model
    user_response = UserResponse(
        user_id=user.user_id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        created_at=user.created_at,
        dob=user.dob,
        gender=user.gender,
        is_disabled=user.is_disabled,
        disability_type=user.disability_type,
        pfp=user.pfp,
    )

    # Manually construct the response dictionary
    response = {
        "user_id": user_response.user_id,
        "name": user_response.name,
        "email": user_response.email,
        "phone": user_response.phone,
        "created_at": user_response.created_at,
        "dob": user_response.dob,
        "gender": user_response.gender,
        "is_disabled": user_response.is_disabled,
        "disability_type": user_response.disability_type,
        "pfp": user_response.pfp,
    }

    # Add group_id if it exists
    if group_id is not None:
        response["group_id"] = group_id

    print(response)
    return response



@app.put("/update_user/", response_model=UserResponse)
async def update_user(user_id: int, user_update: UserUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.user_id == user_id))
    user = result.scalar()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Update user attributes if provided
    if user_update.name is not None:
        user.name = user_update.name
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.phone is not None:
        user.phone = user_update.phone
    if user_update.password_hash is not None:
        user.password_hash = user_update.password_hash
    if user_update.dob is not None:
        user.dob = user_update.dob
    if user_update.gender is not None:
        user.gender = user_update.gender
    if user_update.is_disabled is not None:
        user.is_disabled = user_update.is_disabled
    if user_update.disability_type is not None:
        user.disability_type = user_update.disability_type
    if user_update.pfp is not None:
        user.pfp = user_update.pfp

    await db.commit()
    await db.refresh(user)

    return user


# Delete a user by ID
@app.delete("/users/{user_id}")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.user_id == user_id))
    user = result.scalar()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()

    return {"message": "User deleted successfully"}



#Helper function to generate a unique join code
def generate_join_code():
    return secrets.token_hex(5).upper()  # Generates a 10-character unique code

#create a new family group
@app.post("/family-groups/", response_model=FamilyGroupResponse)
async def create_family_group(group: FamilyGroupCreate, db: AsyncSession = Depends(get_db)):
    # Check if the user creating the group exists
    result = await db.execute(select(User).filter(User.user_id == group.created_by))
    user = result.scalar()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate a unique join code
    join_code = generate_join_code()

    # Create a new family group
    new_group = FamilyGroup(
        group_name=group.group_name,
        join_code=join_code,
        created_by=group.created_by,
    )

    # Add and commit the new group to the database
    db.add(new_group)
    await db.commit()
    await db.refresh(new_group)

    # Add the creator as a member of the group
    new_member = FamilyMember(
        group_id=new_group.group_id,
        user_id=group.created_by,
    )

    # Add and commit the new member to the database
    db.add(new_member)
    await db.commit()
    await db.refresh(new_member)

    return new_group

# Join a family group using the join code
@app.post("/family-groups/join/", response_model=FamilyMemberResponse)
async def join_family_group(join_data: FamilyGroupJoin, db: AsyncSession = Depends(get_db)):
    # Check if the user exists
    result = await db.execute(select(User).filter(User.user_id == join_data.user_id))
    user = result.scalar()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the family group exists with the provided join code
    result = await db.execute(select(FamilyGroup).filter(FamilyGroup.join_code == join_data.join_code))
    group = result.scalar()
    if not group:
        raise HTTPException(status_code=404, detail="Family group not found")

    # Check if the user is already a member of the group
    result = await db.execute(select(FamilyMember).filter(
        FamilyMember.group_id == group.group_id,
        FamilyMember.user_id == join_data.user_id
    ))
    existing_member = result.scalar()
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member of this group")

    # Add the user to the family group
    new_member = FamilyMember(
        group_id=group.group_id,
        user_id=join_data.user_id,
    )

    # Add and commit the new member to the database
    db.add(new_member)
    await db.commit()
    await db.refresh(new_member)

    return new_member



@app.get("/family-groups/{group_id}/members/", response_model=list[FamilyMemberResponse])
async def get_family_group_members(group_id: int, db: AsyncSession = Depends(get_db)):
    # Check if the family group exists
    result = await db.execute(select(FamilyGroup).filter(FamilyGroup.group_id == group_id))
    group = result.scalar()
    if not group:
        raise HTTPException(status_code=404, detail="Family group not found")

    # Get all members of the group
    result = await db.execute(select(FamilyMember).filter(FamilyMember.group_id == group_id))
    members = result.scalars().all()

    # Extract user_ids from family members
    user_ids = [m.user_id for m in members]

    # Fetch user details in one query
    result = await db.execute(select(User).filter(User.user_id.in_(user_ids)))
    users = {u.user_id: u for u in result.scalars().all()}  # Store users in a dict for quick lookup

    # Prepare response list
    response = []
    for member in members:
        user = users.get(member.user_id)
        if user:
            result = await db.execute(select(LiveLocation).where(LiveLocation.user_id == member.user_id))
            live_location = result.scalars().first()
            
            response.append(FamilyMemberResponse(
                group_id=member.group_id,
                user_id=user.user_id,
                added_at=member.added_at.isoformat(),
                gender=user.gender.value if hasattr(user.gender, "value") else user.gender,
                dob=user.dob.isoformat() if user.dob else None,
                name=user.name,
                pfp=user.pfp,
                location=f"{live_location.location["latitude"],live_location.location["longitude"]}"
            ))
            
            # print(live_location.location[])

    return response



# Update a family group's name
@app.patch("/family_groups/{group_id}", response_model=FamilyGroupResponse)
async def update_family_group_name(
    group_id: int,
    update_data: FamilyGroupUpdate,  # JSON body containing current_user_id and group_name
    db: AsyncSession = Depends(get_db),
):
    # Fetch the family group by group_id
    result = await db.execute(select(FamilyGroup).filter(FamilyGroup.group_id == group_id))
    family_group = result.scalar_one_or_none()

    if family_group is None:
        raise HTTPException(status_code=404, detail="Family group not found")

    # Check if the current user is the creator of the group
    if family_group.created_by != update_data.current_user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to update this group")

    # Update the group_name
    family_group.group_name = update_data.group_name

    # Commit the changes to the database
    await db.commit()
    await db.refresh(family_group)

    # Return the updated family group
    return FamilyGroupResponse(
        group_id=family_group.group_id,
        group_name=family_group.group_name,
        join_code=family_group.join_code,
        created_by=family_group.created_by,
        created_at=family_group.created_at,
        is_creator=family_group.created_by == update_data.current_user_id,
    )
    
    
# Delete a family group
@app.delete("/family-groups/")
async def delete_family_group(group_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    # Check if the family group exists
    result = await db.execute(select(FamilyGroup).filter(FamilyGroup.group_id == group_id))
    group = result.scalar()
    if not group:
        raise HTTPException(status_code=404, detail="Family group not found")

    # Check if the user requesting the deletion is the creator of the group
    if group.created_by != user_id:
        raise HTTPException(status_code=403, detail="Only the creator of the group can delete it")

    # Delete the family group
    await db.delete(group)
    await db.commit()

    return {"message": "Family group deleted successfully"}

# Utility function to create QR code
async def create_qr_code(group_id: int, group_name: str, join_code: str) -> str:
    # Replace spaces with underscores in the group name to avoid URL issues
    safe_group_name = group_name.replace(" ", "_")
    
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
    qr.add_data(join_code)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save QR code in the static/qr folder
    qr_image_path = f"static/qr/{safe_group_name}_{group_id}_qr.png"
    os.makedirs(os.path.dirname(qr_image_path), exist_ok=True)  # Create the directory if it doesn't exist
    img.save(qr_image_path)
    
    return qr_image_path

@app.get('/qr')
async def getQR(group_id: int, db: AsyncSession = Depends(get_db)):
    # Query the group based on the group_id
    result = await db.execute(select(FamilyGroup).filter(FamilyGroup.group_id == group_id))
    group = result.scalar()

    if not group:
        return {"detail": "Group not found"}

    group_name = group.group_name
    join_code = group.join_code

    # Path where the QR code will be saved
    safe_group_name = group_name.replace(" ", "_")  # Handle spaces
    filename = f"qr/{safe_group_name}_{group_id}_qr.png"
    file_path = os.path.join("static", filename)  # Static file path

    # If the file does not exist, generate the QR code
    if not os.path.exists(file_path):
        await create_qr_code(group_id=group_id, group_name=group_name, join_code=join_code)

    # Return the file as a response
    return FileResponse(file_path)



@app.post('/login')
async def loginview(email: str, password: str, db: AsyncSession = Depends(get_db)):
    # Fetch user and family memberships in one query
    result = await db.execute(
        select(User)
        .options(selectinload(User.family_memberships))  # Eager load related FamilyMember
        .filter(User.email == email)
    )
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.password_hash!=password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Extract group_id from the family member relationships
    group_id = None
    if user.family_memberships:
        group_id = user.family_memberships[0].group_id

    # Prepare the response using the UserResponse model
    user_response = UserResponse(
        user_id=user.user_id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        created_at=user.created_at,
        dob=user.dob,
        gender=user.gender,
        is_disabled=user.is_disabled,
        disability_type=user.disability_type,
        pfp=user.pfp,
    )

    # Manually construct the response dictionary
    response = {
        "user_id": user_response.user_id,
        "name": user_response.name,
        "email": user_response.email,
        "phone": user_response.phone,
        "created_at": user_response.created_at,
        "dob": user_response.dob,
        "gender": user_response.gender,
        "is_disabled": user_response.is_disabled,
        "disability_type": user_response.disability_type,
        "pfp": user_response.pfp,
    }

    # Add group_id if it exists
    if group_id is not None:
        response["group_id"] = group_id

    print(response)
    #return response

    return {"message": "Successfully logged in", "user": response}


@app.post("/locations/", response_model=LocationCreate)
async def create_location(location: LocationCreate,  db: AsyncSession = Depends(get_db)):
    new_location = Location(
        user_id=location.user_id,
        location_name=location.location_name,
        #place_name=location.place_name,
        latitude=location.latitude,
        longitude=location.longitude
    )
    db.add(new_location)
    await db.commit()
    await db.refresh(new_location)
    return new_location

class LocationResponse(LocationCreate):
    location_id: int
from typing import List

@app.get("/locations/{user_id}", response_model=List[LocationResponse])
async def get_locations(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Location).filter(Location.user_id == user_id))
    locations = result.scalars().all()
    
    if not locations:
        raise HTTPException(status_code=404, detail="No locations found for this user")
    print(locations)
    return locations

class LocationUpdate(BaseModel):
    device_id: str
    latitude: float
    longitude: float


@app.post("/update-location/{user_id}")
async def update_location(user_id: int, location: LocationUpdate, db: AsyncSession = Depends(get_db)):
    # Find the user's live location in the database
    result = await db.execute(select(LiveLocation).filter(LiveLocation.user_id == user_id))
    live_location = result.scalars().first()  # Correct way to fetch a single record

    if live_location:
        # Update existing location record
        live_location.device_id = location.device_id
        live_location.location = {"latitude": location.latitude, "longitude": location.longitude}
        live_location.last_updated = datetime.utcnow()
        await db.commit()  # Commit the transaction
        await db.refresh(live_location)  # Refresh the updated object
    else:
        # Insert new location record
        new_location = LiveLocation(
            user_id=user_id,
            device_id=location.device_id,
            location={"latitude": location.latitude, "longitude": location.longitude},
            last_updated=datetime.now()
        )
        db.add(new_location)
        await db.commit()
        await db.refresh(new_location)  # Ensure the new object is refreshed
        return {"message": "Location created successfully", "data": new_location}

    return {"message": "Location updated successfully", "data": live_location}



@app.post('/sos_alert')
async def send_sos_alert(user_id: int, db: AsyncSession = Depends(get_db)):
    # Fetch the latest live location from the database
    result = await db.execute(select(LiveLocation).filter(LiveLocation.user_id == user_id).order_by(LiveLocation.last_updated.desc()))
    live_location = result.scalar()

    if not live_location:
        raise HTTPException(status_code=404, detail="Live location not found for user")
    loc=live_location.location
    latitude = loc["latitude"]
    longitude = loc["longitude"]

    # Fetch user's family group
    result = await db.execute(select(FamilyMember).filter(FamilyMember.user_id == user_id))
    family_member = result.scalar()
    
    if not family_member:
        raise HTTPException(status_code=404, detail="User is not part of a family group")

    group_id = family_member.group_id

    # Get all family members
    result = await db.execute(select(FamilyMember).filter(FamilyMember.group_id == group_id))
    members = result.scalars().all()
    
    user_ids = [m.user_id for m in members if m.user_id != user_id]  # Exclude the sender

    # Fetch family members' details
    result = await db.execute(select(User).filter(User.user_id.in_(user_ids)))
    users = result.scalars().all()

    phone_numbers = [u.phone for u in users if u.phone]
    emails = [u.email for u in users if u.email]

    sos_message = f"🚨 SOS Alert! Your family member is in distress at https://maps.google.com/?q={latitude},{longitude}. Please check immediately."

    print(phone_numbers)
    #Send SMS
    try:
        for p in phone_numbers:
            send_sms(f'+91{p}', sos_message)
    except Exception as e:
        print(f"Failed to send SMS to {p}: {e}")

    # Send Emails
    # if emails:
    #     send_email_alert(emails, sos_message)

    return {"message": "SOS alert sent successfully"}





class PastTripCreate(BaseModel):
    user_id: int
    start_location_name: str
    start_latitude: float
    start_longitude: float
    destination_name: str
    destination_latitude: float
    destination_longitude: float
    trip_date: date  # Use date directly
    trip_time: str  # Use datetime directly
    feedback: Optional[str] = None

    class Config:
        from_attributes = True  # Enables conversion from ORM model in Pydantic v2

class PastTripResponse(BaseModel):
    trip_id: int
    user_id: int
    start_location_name: str
    start_latitude: float
    start_longitude: float
    destination_name: str
    destination_latitude: float
    destination_longitude: float
    trip_date: date  # Use date directly
    trip_time: datetime  # Use datetime directly
    feedback: Optional[str] = None

    class Config:
        from_attributes = True  # Enables conversion from ORM model in Pydantic v2
        
        
        
@app.post("/past_trips/", response_model=PastTripResponse)
async def create_past_trip(trip: PastTripCreate, db: AsyncSession = Depends(get_db)):
    try:
        # Convert the trip_date string to a date object
        trip_date = trip.trip_date
        
        # Convert the trip_time string ('14:30') to a time object
        trip_time = datetime.strptime(trip.trip_time, "%H:%M").time()
        
        # Combine the date and time into a datetime object
        trip_datetime = datetime.combine(trip_date, trip_time)

        # Create a new PastTrip object (SQLAlchemy ORM model)
        new_trip = PastTrip(
            user_id=trip.user_id,
            start_location_name=trip.start_location_name,
            start_latitude=trip.start_latitude,
            start_longitude=trip.start_longitude,
            destination_name=trip.destination_name,
            destination_latitude=trip.destination_latitude,
            destination_longitude=trip.destination_longitude,
            trip_date=trip_date,
            trip_time=trip_datetime,  # Pass the combined datetime
            feedback=trip.feedback
        )

        # Add the new trip to the database and commit
        db.add(new_trip)
        await db.commit()
        await db.refresh(new_trip)

        # Return the response using the Pydantic model
        return PastTripResponse.from_orm(new_trip)  # Convert ORM object to Pydantic model for response

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred while creating the trip: {e}")


# GET: Retrieve all past trips for a user
@app.get("/past_trips/{user_id}", response_model=list[PastTripResponse])
async def get_past_trips(user_id: int, db: AsyncSession = Depends(get_db)):
    try:
        # Execute the query to get past trips for the user
        result = await db.execute(select(PastTrip).where(PastTrip.user_id == user_id))
        trips = result.scalars().all()

        # If no trips found, raise an exception
        if not trips:
            raise HTTPException(status_code=404, detail="No trips found for this user.")

        # Convert each ORM model to the Pydantic response model
        return [PastTripResponse.from_orm(trip) for trip in trips]

    except Exception as e:
        # Handle any unexpected errors
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")