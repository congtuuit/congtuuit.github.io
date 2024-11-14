const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Đường dẫn thư mục để lưu ảnh captcha
const SAVE_DIR = './data_captchas';
const CAPTCHA_URL = 'https://digiapp.vietcombank.com.vn/utility-service/v2/captcha/MASS/';

// Tạo thư mục lưu ảnh nếu chưa tồn tại
if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR);
}

// Hàm tải và lưu captcha
async function downloadCaptcha() {
    try {
        // Tạo một GUID ngẫu nhiên
        const randomGuid = uuidv4();
        const url = `${CAPTCHA_URL}${randomGuid}`;

        // Gửi yêu cầu HTTP GET để tải ảnh
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Kiểm tra nếu tải ảnh thành công
        if (response.status === 200) {
            // Đặt tên file cho ảnh
            const fileName = `${uuidv4()}.jpg`;
            const filePath = path.join(SAVE_DIR, fileName);

            // Lưu ảnh vào thư mục
            fs.writeFileSync(filePath, response.data);
            console.log(`Captcha saved: ${fileName}`);
        }
    } catch (error) {
        console.error(`Failed to download captcha: ${error.message}`);
    }
}

// Hàm tải nhiều ảnh captcha
async function downloadMultipleCaptchas(count = 10) {
    for (let i = 0; i < count; i++) {
        await downloadCaptcha();
    }
}

// Số lượng captcha cần tải (thay đổi tùy ý)
const CAPTCHA_COUNT = 50;

// Bắt đầu tải ảnh
downloadMultipleCaptchas(CAPTCHA_COUNT).then(() => {
    console.log(`Downloaded ${CAPTCHA_COUNT} captchas successfully.`);
});
