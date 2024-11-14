import cv2
import numpy as np
import os
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Reshape, Input
from tensorflow.keras.optimizers import Adam
import tensorflow as tf
from sklearn.model_selection import train_test_split

# Thiết lập chiều cao và chiều rộng của ảnh
height, width = 100, 200  # Kích thước của captcha (có thể thay đổi tùy vào dữ liệu của bạn)

# Tiền xử lý hình ảnh
def preprocess_image(image_path):
    image = cv2.imread(image_path)
    image = cv2.resize(image, (width, height))
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = gray / 255.0  # Chuẩn hóa hình ảnh
    return gray.reshape((height, width, 1))

# Hàm tải dữ liệu
def load_data(captcha_dir):
    data = []
    labels = []
    
    for filename in os.listdir(captcha_dir):
        if filename.endswith('.jpg'):  # Đọc ảnh .jpg
            image_path = os.path.join(captcha_dir, filename)
            image = preprocess_image(image_path)
            
            label = filename.split('.')[0]  # Nhãn từ tên file
            data.append(image)
            labels.append(label)
    
    return np.array(data), np.array(labels)

# Chuyển nhãn thành dạng one-hot cho từng ký tự
def convert_labels_to_one_hot(labels, max_length=5):
    label_one_hot = np.zeros((len(labels), max_length, 10), dtype=np.float32)
    for i, label in enumerate(labels):
        for j, char in enumerate(label):
            label_one_hot[i, j, int(char)] = 1  # Đặt giá trị one-hot cho mỗi ký tự
    return label_one_hot

# Đọc dữ liệu từ thư mục
captcha_dir = 'path_to_your_captcha_images'  # Đường dẫn tới thư mục chứa các hình ảnh captcha
data, labels = load_data(captcha_dir)

# Chuyển đổi nhãn thành one-hot
max_length = 5  # Số lượng ký tự trong mỗi captcha
labels_one_hot = convert_labels_to_one_hot(labels, max_length)

# Chia dữ liệu thành tập huấn luyện và kiểm tra (80% huấn luyện, 20% kiểm tra)
X_train, X_test, y_train, y_test = train_test_split(data, labels_one_hot, test_size=0.2)

X_train = X_train.reshape(-1, height, width, 1)
X_test = X_test.reshape(-1, height, width, 1)

# Cập nhật mô hình với CTC Loss
def build_model_ctc():
    input_image = Input(shape=(height, width, 1), name='image_input')
    
    # Lớp Conv2D đầu tiên
    x = Conv2D(32, (3, 3), activation='relu')(input_image)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    
    # Lớp Conv2D thứ hai
    x = Conv2D(64, (3, 3), activation='relu')(x)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    
    # Lớp Flatten
    x = Flatten()(x)
    
    # Lớp Dense (tạo ra một vector có chiều dài max_length * 10)
    x = Dense(max_length * 10, activation='linear')(x)
    
    # Reshape lại thành (batch_size, max_length, 10)
    output = Reshape((max_length, 10))(x)
    
    model = Model(inputs=input_image, outputs=output)
    
    # Biên dịch mô hình
    model.compile(optimizer=Adam(), loss='categorical_crossentropy')  # CTC Loss sử dụng categorical_crossentropy
    
    return model

# Xây dựng mô hình CTC
model_ctc = build_model_ctc()

# Huấn luyện mô hình
model_ctc.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test))

# Hàm giải mã captcha
def decode_ctc(prediction):
    # Chọn chỉ số có độ tin cậy cao nhất cho mỗi ký tự
    decoded = np.argmax(prediction, axis=2)
    
    # Loại bỏ lớp padding (10 là lớp padding trong one-hot)
    result = ''.join(str(i) for i in decoded[0] if i != 10)  
    
    return result

# Giải mã captcha mới
def solve_captcha(image_path):
    image = preprocess_image(image_path)
    image = np.expand_dims(image, axis=0)  # Thêm chiều batch
    
    prediction = model_ctc.predict(image)
    
    decoded_captcha = decode_ctc(prediction)
    
    return decoded_captcha

# Giải mã captcha
captcha_image = '14272.jpg'  # Đường dẫn đến hình ảnh captcha cần giải mã
predicted_captcha = solve_captcha(captcha_image)
print(f'Predicted captcha: {predicted_captcha}')
