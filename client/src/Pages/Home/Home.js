import React from 'react';
import './Home.css'; // Đảm bảo bạn có file CSS tương ứng
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    
    <div className='home'>
      {/* Màn hình chính nè */}
      <div className="main_slide">
        <div>
          <h1>Thưởng thức <span>mỹ vị nhân gian</span> ngay tại nơi đây!</h1>
          <p className="choose-us">Choose us, join the fuss!</p>
          <Link to='./reservation' className='home-btn'>
            <button >Đặt bàn ngay</button>
          </Link> 
          <div className="view-more">
            <Link to='./menu' className="view-menu">
                  Xem menu
            <i className="fa-solid fa-arrow-right" style={{ color: '#ede9d2', marginLeft: '10px' }}></i>
            </Link>
          </div>
        </div>

        <div>
          <img src="/assets/Chinese Turnip Cake (Lo Bak Go, 萝卜糕).jpg" alt="Chinese Turnip Cake" />
        </div>
      </div>

      <hr style={{ width: '100%', margin: '0 auto', marginTop: '60px' }} />



      {/* Chỗ này là giới thiệu ngắn */}
      <div className="introduction">
        <h1>Giới thiệu</h1>
        <div className="intro-img">
          <img src="/assets/202109-BlackBlue-7-e163645146074.png" alt="Intro 1" />
          <img src="/assets/chianfodd.png" alt="Intro 2" />
          <img src="/assets/wtr.png" alt="Intro 3" />
        </div>

        <div className="intro-para" style={{ margin: '50px' }}>
          <p>Được thành lập vào năm 2024 bởi ba nhà sáng lập có tầm nhìn và đam mê là Hào, Nhật và Trí, nhà hàng của chúng tôi đại diện cho sự hòa quyện hài hòa giữa các truyền thống ẩm thực lâu đời và những trải nghiệm ăn uống hiện đại. Chúng tôi tự hào tạo nên một không gian nơi hương vị phong phú của các món ăn cổ điển gặp gỡ sự đổi mới trong ẩm thực hiện đại.</p>
          <p>Tại nhà hàng của chúng tôi, mỗi bữa ăn là một cơ hội để thưởng thức các nguyên liệu chất lượng cao và những món ăn được chế biến tinh tế. Thực đơn của chúng tôi được tuyển chọn cẩn thận để mang đến nhiều lựa chọn hương vị phong phú.</p>
          <div className="view-more">
            <Link to='./menu'>Xem thêm</Link>
          </div>
        </div>
      </div>



      {/* Menu ở đây */}
      <div className="menu-title">
        <hr />
        <h1>Menu</h1>
        <hr />
      </div>

      <div className="menu-items">
        <div className="item">
          <div>
            <img src="/assets/Verum curry (coconut curry).jpg" alt="food item" />
          </div>
          <h3>Món chính</h3>
          <Link to='./menu'>
            <button className="menu-btn">Xem Menu</button>
          </Link>
        </div>

        <div className="item">
          <div>
            <img src="/assets/flan.png" alt="food item" />
          </div>
          <h3>Tráng miệng</h3>
          <Link to='./menu'>
            <button className="menu-btn">Xem Menu</button>
          </Link>
        </div>

        <div className="item">
          <div>
            <img src="/assets/drinks.png" alt="food item" />
          </div>
          <h3>Thức uống</h3>
          <Link to='./menu'>
            <button className="menu-btn">Xem Menu</button>
          </Link>
        </div>
      </div>



      {/* Đặt bàn */}
      <div className="banner"  style={{
                backgroundImage: 'url(/assets/rs.png)' }}>
        <div className="banner-content" >
          <h1>Sẵn sàng trải nghiệm nhà hàng của chúng tôi?</h1>
          <p>Dù bạn đang tìm kiếm một bữa ăn nhanh hay một buổi họp mặt đặc biệt, nhà hàng của chúng tôi luôn tận tâm mang đến những món ăn chất lượng cao và không gian chào đón.</p>
          <Link to='./reservation'>
            <button>Đặt bàn ngay</button>
          </Link>
        </div>
      </div>



      {/* Sự kiện */}
      <div className="event">
        <h1>Sự kiện</h1>

        <div className="main-event">
          <img src="/assets/jazz.png" alt="Jazz Event" />

          <div className="event-info">
            <h2>Đêm nhạc Jazz</h2>
            <p>Thưởng thức những âm thanh mượt mà và tinh tế của nhạc jazz sống mỗi tối thứ Sáu.</p>
          </div>
        </div>

        <div className="other-event">
          <div className="event-item">
            <img src="/assets/viokon.png" alt="Aucostic Night" />
            <p>Đêm diễn Aucostic</p>
          </div>


          <div className="event-item">
            <img src="/assets/sgner.png" alt="VIP Dinner Concert" />
            <p>Concert ăn tối VIP</p>
          </div>

          <div className="event-item">
            <img src="/assets/ev.png" alt="Melody from Meal" />
            <p>Giai điệu từ bữa ăn</p>
          </div>

          <div className="event-item">
            <img src="/assets/ev2.png" alt="Music Performances" />
            <p>Buổi diễn các dòng nhạc</p>
          </div>
        </div>

        <div className="view-more">
          <a>Xem thêm</a>
        </div>
      </div>
    </div>
  );
};

export default Home;