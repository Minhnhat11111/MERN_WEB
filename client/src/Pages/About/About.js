import React from 'react';
import './About.css';

const About = () => {
  return (
   <div>
        <div className="title-about">
        <h1>Giới thiệu về chúng tôi</h1>
      </div>

      <div className="main-content1">
        <div className="first-content">
          <img src="/assets/intro.png" alt="Giới thiệu" />
          <h1>Hân hạnh được phục vụ bạn khi đặt chân đến nhà hàng Tewaisuu</h1>
          <p>
            Được thành lập vào năm 2024 bởi ba nhà sáng lập tận tâm là Hào, Trí và Nhật, Teuwaisuu không chỉ là một nơi để thưởng thức ẩm thực mà còn là sự tôn vinh di sản ẩm thực Trung Quốc được mang đến đời sống. Với niềm đam mê chung về ẩm thực và mong muốn mang hương vị chân thực của Trung Quốc đến với thế giới, các nhà sáng lập đã hình dung ra một nhà hàng nơi mọi người, bất kể nền tảng hay sở thích, đều có thể thưởng thức những món ăn Trung Hoa tinh túy trong một không gian chào đón và trang nhã.
          </p>
          <br></br>
          <p>
            Tại Teuwaisuu, chúng tôi tự hào về khả năng phục vụ mọi đối tượng khách hàng. Dù bạn đang tìm kiếm một bữa trưa thoải mái với đồng nghiệp, một bữa tối sang trọng cho dịp đặc biệt, hay đơn giản chỉ muốn khám phá sự phong phú của ẩm thực Trung Hoa, chúng tôi đều có điều gì đó dành cho bạn. Sứ mệnh của chúng tôi là tạo ra một trải nghiệm ẩm thực phản ánh sự đa dạng phong phú của ẩm thực Trung Quốc, với mỗi món ăn được chế biến cẩn thận để tôn vinh hương vị đậm đà và tinh tế đặc trưng của nền ẩm thực tuyệt vời này.
          </p>
        </div>

        <div className="star-section">
          <hr />
          <span className="star">★</span>
          <hr />
        </div>

        <div className="second-content">
          <div className="second-content-img">
            <img src="/assets/menu1.png" alt="Menu 1" />
          </div>

          <div className="second-content-description">
            <p>
              Thực đơn của chúng tôi là một bộ sưu tập phong phú các món ăn đặc sản vùng miền trên khắp Trung Quốc, bao gồm từ những món cổ điển quen thuộc đến những cách tân hiện đại của các món ăn truyền thống. Dù bạn đang thưởng thức sự cân bằng tinh tế giữa vị chua và ngọt, cảm nhận độ cay nồng của gia vị Tứ Xuyên, hay đắm mình trong sự đậm đà của ẩm thực Quảng Đông, các đầu bếp của chúng tôi luôn cam kết sử dụng những nguyên liệu tốt nhất để duy trì hương vị nguyên bản từ nơi xuất xứ.
            </p>

            <p>
              Mỗi món ăn được chế biến cẩn thận để phản ánh hương vị độc đáo và truyền thống ẩm thực của từng vùng miền, từ món ăn đường phố đầy màu sắc của Tây An đến ẩm thực tinh tế và sang trọng của Thượng Hải. Đội ngũ đầu bếp tận tâm của chúng tôi làm việc không ngừng nghỉ để hoàn thiện từng công thức, đảm bảo rằng mỗi miếng ăn đều đưa bạn đến gần hơn với hương vị chân thực của Trung Quốc. Từ mì kéo tay đến các món thịt hầm chậm, mỗi món ăn trong thực đơn của chúng tôi đều kể một câu chuyện — một hành trình qua những vùng đất đa dạng và lịch sử văn hóa phong phú.
            </p>
          </div>

          <div className="second-content-img">
            <img src="/assets/menu2.png" alt="Menu 2" />
          </div>
        </div>

        <div className="star-section">
          <hr />
          <span className="star">★</span>
          <hr />
        </div>

        <div className="last-content">
          <div className="last-description">
            <p>
              Chúng tôi tin rằng việc thưởng thức ẩm thực không chỉ là về món ăn, mà còn là việc tạo nên những kỷ niệm. Nhà hàng được thiết kế trang nhã của chúng tôi mang đến một không gian ấm cúng và chào đón, nơi mọi khách hàng đều có thể cảm thấy như ở nhà. Với dịch vụ tận tâm và sự chú ý đến từng chi tiết, chúng tôi mong muốn mang lại một trải nghiệm ẩm thực tuyệt vời cho từng vị khách. Đội ngũ của chúng tôi luôn sẵn sàng để biến thời gian của bạn tại Teuwaisuu trở thành kỷ niệm khó quên, dù bạn đến dùng bữa cùng gia đình, bạn bè, hay đối tác kinh doanh.
            </p>

            <br></br>

            <p>
              Tại Teuwaisuu, chúng tôi chào đón mọi người từ mọi tầng lớp đến khám phá vẻ đẹp và sự phong phú của ẩm thực Trung Hoa. Cam kết về chất lượng, tính chân thực, và lòng hiếu khách của chúng tôi thể hiện rõ trong mọi khía cạnh, từ khoảnh khắc bạn bước qua cửa cho đến miếng ăn cuối cùng. Hãy đến và để niềm đam mê ẩm thực và văn hóa của chúng tôi đưa bạn vào một hành trình ẩm thực đầy cuốn hút, khiến bạn muốn quay lại nhiều lần nữa.
            </p>
          </div>

          <div className="last-img">
            <img src="/assets/chieff.png" alt="Chef" />
          </div>
        </div>
      </div>
   </div>
      
   
  );
};

export default About;
