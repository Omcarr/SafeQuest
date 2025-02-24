from sqlalchemy import Enum as SQLAlchemyEnum
from datetime import date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey, Float, TIMESTAMP, text, JSON, Boolean, Date
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from enum import Enum
from sqlalchemy.types import TypeDecorator
Base = declarative_base()

class Gender(Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"

# Custom TypeDecorator to store Enum as a string in the database
class EnumString(TypeDecorator):
    impl = SQLAlchemyEnum

    def process_bind_param(self, value, dialect):
        if isinstance(value, Enum):
            return value.value  # Store the string value of the enum
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            return Gender(value)  # Convert back to the enum type
        return value
    
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True)
    password_hash = Column(String, nullable=False)
    
    dob = Column(Date, nullable=True)  # Date of birth
    age = Column(Integer, nullable=True)  # User's age (calculated)
    gender = Column(String, nullable=True)
    pfp = Column(String, default=None)  # Profile picture URL or file path (empty by default)
    is_disabled = Column(Boolean, default=False)  # Whether the user has a disability
    disability_type = Column(String(100), nullable=True)  # Type of disability (if applicable)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    family_memberships = relationship("FamilyMember", back_populates="user", cascade="all, delete")
    live_location = relationship("LiveLocation", back_populates="user", uselist=False, cascade="all, delete")

    # Hybrid Property to calculate age based on DOB
    @hybrid_property
    def age(self):
        if self.dob:
            today = date.today()
            return today.year - self.dob.year - ((today.month, today.day) < (self.dob.month, self.dob.day))
        return None

    @age.setter
    def age(self, value):
        # This setter is required for SQLAlchemy to recognize the hybrid property
        pass

class Location(Base):
    __tablename__ = "locations"
    
    location_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    location_name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)


class LiveLocation(Base):
    __tablename__ = "live_locations"

    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    device_id = Column(String(50), nullable=True)  # Support multiple devices per user
    location = Column(JSON, nullable=False)  # Stores {'latitude': x, 'longitude': y}
    last_updated = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"), onupdate=text("CURRENT_TIMESTAMP"))

    # Relationship
    user = relationship("User", back_populates="live_location")


class FamilyGroup(Base):
    __tablename__ = "family_groups"

    group_id = Column(Integer, primary_key=True, autoincrement=True)
    group_name = Column(String(100), nullable=False)
    join_code = Column(String(10), unique=True, nullable=False)  # Unique code to join the family
    created_by = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationship
    members = relationship("FamilyMember", back_populates="group", cascade="all, delete")


class FamilyMember(Base):
    __tablename__ = "family_members"

    group_id = Column(Integer, ForeignKey("family_groups.group_id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    added_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    user = relationship("User", back_populates="family_memberships")
    group = relationship("FamilyGroup", back_populates="members")


class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    alert_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    location = Column(JSON, nullable=False)  # Store {'latitude': x, 'longitude': y}
    alert_time = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    resolved = Column(Boolean, default=False)  # Track if the alert has been resolved

    # Relationship
    user = relationship("User")


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    contact_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    contact_name = Column(String(100), nullable=False)
    contact_phone = Column(String(20), nullable=False)

class PastTrip(Base):
    __tablename__ = "past_trips"

    trip_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

    start_location_name = Column(String(255), nullable=False)
    start_latitude = Column(Float, nullable=False)
    start_longitude = Column(Float, nullable=False)

    destination_name = Column(String(255), nullable=False)
    destination_latitude = Column(Float, nullable=False)
    destination_longitude = Column(Float, nullable=False)

    trip_date = Column(Date, nullable=False)  # Stores only the date
    trip_time = Column(TIMESTAMP, nullable=False)  # Stores time in 24-hour format

    feedback = Column(String(500), nullable=True)  # Optional feedback on the route

    # Relationship
    user = relationship("User", back_populates="past_trips")

# Add relationship in User model
User.past_trips = relationship("PastTrip", back_populates="user", cascade="all, delete")
