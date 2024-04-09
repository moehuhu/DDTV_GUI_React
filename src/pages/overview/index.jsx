import RoomList from './RoomList'
import SystemResource from './SystemResource'
import './style.css'
import { theme } from 'antd';

const Rooms = () => {
  const { token } = theme.useToken()
  return <div
    className='overview'
    style={{ borderRadius: token.borderRadiusLG }}>
    <RoomList />
    <SystemResource />
  </div>
}

export default Rooms