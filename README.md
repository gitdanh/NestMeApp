Các yêu cầu về môi trường cài đặt và phiên bản phần mềm
-	Ngôn ngữ lập trình: JavaScript.
-	Hệ thống cơ sở dữ liệu: MongoDB.
-	Quản lý mã nguồn: Github.
-	Hệ quản trị cơ sở dữ liệu: MongoDB Atlas.
-	Thiết kế Usecase và biểu đồ: Draw.io.
-	Phiên bản MongoDB: 5.0.14.
-	Phiên bản ExpressJS: 4.17.1.
-	Phiên bản React: 18.2.0.
-	Phiên bản NodeJS: 16.16.0.

Cài đặt Server:

Cài đặt các package dành cho Server: bcrypt(5.1.1), body-parser(1.20.2), compression(1.7.4), cookie-parser(1.4.6), cors(2.8.5), express(4.18.2), express-session (1.17.3), express-validator(7.0.1), firebase(10.5.0), helmet(7.0.0), jsonwebtoken(9.0.2), mongoose(7.6.3), mongoose-unique-validator (4.0.0), nodemailer (6.9.7), socket.io(4.7.2).


Tổ chức các thư mục và file:
Bao gồm:
-	controllers: để chứa code các function xử lý cho các routes.
-	middleware: chứa các middleware (Middleware là các hàm khác nhau được gọi bởi [Route Express] trước khi các yêu cầu hoàn tất.).
-	models: dùng để cung cấp dữ liệu, thực hiện kết nối, trích lọc, chèn, chỉnh sửa dữ liệu trong database, tương tác với file system, network.
-	routes: dùng để chuyển hướng các URL đến các hàm xử lý tương ứng.
-	env: chứa các tham số cấu hình.
-	server.js: tạo kết nối đến express, mongoDB và socket.io.
-	socketServer.js: chứa các phương thức của socket.io.



Cài đặt Client
Cài đặt các package dành cho Client: @babel/plugin-proposal-private-property-in-object(7.14.5), @emotion/react(11.11.1), @emotion/styled(11.11.0), @mui/icons-material (5.14.11), @testing-library/jest-dom (5.11.9), @testing-library/react (11.2.3), @testing-library/user-event(12.6.2), @mui/material(5.14.13), axios (1.5.1), chart.js(4.4.0), classnames(2.3.2), date-fns(2.30.0), emoji-picker-react(4.5.7), firebase(10.5.0), install (0.13.0), moment(2.29.4), npm(10.1.0), react (18.2.0), react-dom (18.2.0), react-moment (1.1.3), react-otp-input(3.1.0), react-router-dom(6.16.0), react-scripts(5.0.1),react-toastify (9.1.3), sass(1.68.0), sass-loader(13.3.2), simplebar-react(3.2.4), socket.io-client (4.7.2), web-vitals (2.1.4).
Tổ chức các thư mục và file:
	 
Bao gồm:
-	components: chứa các thành phần giao diện có thể tái sử dụng.
-	config: chứa kết nối firebase.
-	routes: chứa các đường dẫn của trang web tới các trang.
-	screens: những trang giao diện chính của ứng dụng như trang chủ, trang nhắn tin, ....
-	services: chứa các file gọi api của trang web.
-	axios: chứa các file cấu hình chung cho gọi việc gọi api 
-	App.js: file chính chứa các route và dùng để render page.



Sử dụng Docker để deploy trên môi trường production
-   Bước 1: Xây dựng Docker file.
-	Bước 2: Sử dụng lệnh “docker build -t thanhdanh/express-app .”, để xây dựng Docker Image.
-	Bước 3: Sử dụng lệnh “docker push thanhdanh/express-app:latest” để đẩy Docker Image lên Docker Hub.
-	Bước 4: Sử dụng đường dẫn của Docker image và dùng service cung cấp bởi render.com để hosting BE.
