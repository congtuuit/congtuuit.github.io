def solve_captcha(image_path):
    image = preprocess_image(image_path)
    image = np.expand_dims(image, axis=0)  # Thêm một chiều batch
    
    # Dự đoán số từ captcha
    prediction = model.predict(image)
    predicted_label = np.argmax(prediction, axis=1)
    
    return ''.join(str(predicted_label[i]) for i in range(len(predicted_label)))

# Giải mã captcha
captcha_image = 'data_captchas/14275.jpg'
predicted_captcha = solve_captcha(captcha_image)
print(f'Predicted captcha: {predicted_captcha}')