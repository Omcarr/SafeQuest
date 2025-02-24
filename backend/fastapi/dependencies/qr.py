import qrcode

def create_qr(code, family_group):
    # Data to be encoded in the QR code

    # Create a QR code instance
    qr = qrcode.QRCode(
        version=1,  # Version of the QR Code, controls its size
        error_correction=qrcode.constants.ERROR_CORRECT_L,  # Error correction level
        box_size=10,  # Size of each box in the QR code grid
        border=4,  # Size of the border (minimum is 4)
    )

    # Add data to the QR code
    qr.add_data(code)
    qr.make(fit=True)

    # Create an image from the QR Code instance
    img = qr.make_image(fill_color="black", back_color="white")

    # Save the image
    img.save(f"{family_group}_qr.png")

    print(f"QR code generated and saved as {family_group}_qr.png")



create_qr(code='44D294DF32',family_group="spit")