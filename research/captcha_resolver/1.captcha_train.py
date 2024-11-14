import numpy as np
import matplotlib.pyplot as plt
import cv2
import os
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Input
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split


# Đọc và tiền xử lý dữ liệu captcha
def load_data(data_dir):
    images = []
    labels = []
    for filename in os.listdir(data_dir):
        if filename.endswith('.jpg') or filename.endswith('.png'):
            label = filename.split('.')[0]  # Giả sử nhãn là tên file (VD: 12345.png -> nhãn là 12345)
            img_path = os.path.join(data_dir, filename)
            image = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            image = cv2.resize(image, (100, 50))  # Resize về kích thước cố định
            images.append(image)
            labels.append(label)
    return np.array(images), np.array(labels)

# Đường dẫn đến thư mục chứa dữ liệu captcha
data_dir = 'data_captchas'
images, labels = load_data(data_dir)

# Chuẩn hóa dữ liệu
images = images / 255.0  # Normalization
images = images.reshape(-1, 50, 100, 1)  # Reshape cho CNN (50x100 kích thước ảnh)

# One-hot encoding cho các ký tự (A-Z, 0-9)
characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
num_classes = len(characters)

def encode_labels(labels, characters):
    encoded = []
    for label in labels:
        encoded_label = []
        for c in label:
            if c in characters:
                encoded_label.append(characters.index(c))
            else:
                # Handle the case where the character is not found
                encoded_label.append(-1)  # or any default value
        encoded.append(encoded_label)
    return np.array(encoded)

# One-hot encode the labels for each character
def one_hot_encode_labels(encoded_labels, num_classes):
    return np.array([to_categorical(label, num_classes=num_classes) for label in encoded_labels])

# Encode the labels
encoded_labels = encode_labels(labels, characters)
encoded_labels_one_hot = one_hot_encode_labels(encoded_labels, num_classes)

# Tách dữ liệu thành tập huấn luyện và tập kiểm tra
X_train, X_test, y_train, y_test = train_test_split(images, encoded_labels_one_hot, test_size=0.2, random_state=42)

# Xây dựng mô hình CNN cho CAPTCHA
input_img = Input(shape=(50, 100, 1))

x = Conv2D(32, (3, 3), activation='relu')(input_img)
x = MaxPooling2D((2, 2))(x)
x = Conv2D(64, (3, 3), activation='relu')(x)
x = MaxPooling2D((2, 2))(x)
x = Flatten()(x)
x = Dense(128, activation='relu')(x)

# Multiple outputs for each character in the label
num_characters = 5  # Define the number of characters in each label
outputs = [Dense(num_classes, activation='softmax')(x) for _ in range(num_characters)]

# Define the model
model = Model(inputs=input_img, outputs=outputs)

# Compile the model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy'] * num_characters  # Set 'accuracy' for each output
)

# model.compile(
#     optimizer='adam',
#     loss='sparse_categorical_crossentropy',  # Sử dụng sparse_categorical_crossentropy
#     metrics=['accuracy'] * num_characters
# )


# Train the model
history = model.fit(X_train, [y_train[:, i] for i in range(num_characters)], epochs=10, validation_data=(X_test, [y_test[:, i] for i in range(num_characters)]))

# Lưu mô hình đã huấn luyện
model.save('captcha_solver_model.h5')

# Evaluate the model on the test data
test_results = model.evaluate(X_test, [y_test[:, i] for i in range(num_characters)])

# Print the test loss and accuracy for each character output
for i in range(num_characters):
    print(f"Output {i + 1} - Loss: {test_results[i]}, Accuracy: {test_results[num_characters + i]}")
