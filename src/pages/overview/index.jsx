import RoomList from './RoomList'
import './style.css'
import { theme } from 'antd';

const Rooms = () => {
  const { token } = theme.useToken()
  return <div
    className='overview'
    style={{ borderRadius: token.borderRadiusLG }}>
    <RoomList />
  </div>
}

export default Rooms