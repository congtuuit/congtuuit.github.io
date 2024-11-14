import pytesseract
import cv2

# Ensure Tesseract is correctly set up
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Windows path, adjust if needed

# Read the image
image = cv2.imread('captcha_image.jpg')

# Convert the image to grayscale
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply thresholding to make text stand out
_, thresh_image = cv2.threshold(gray_image, 150, 255, cv2.THRESH_BINARY)

# Alternatively, use adaptive thresholding for varying lighting conditions
# thresh_image = cv2.adaptiveThreshold(gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
#                                      cv2.THRESH_BINARY, 11, 2)

# Optionally apply some denoising
thresh_image = cv2.medianBlur(thresh_image, 3)

# Show the image to check preprocessing
cv2.imshow('Processed Image', thresh_image)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Use Tesseract to extract text
text = pytesseract.image_to_string(thresh_image, config='outputbase digits')

print(f'Extracted text: "{text}"')
