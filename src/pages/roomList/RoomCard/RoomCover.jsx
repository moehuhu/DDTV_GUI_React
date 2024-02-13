import { Image, } from 'antd';
const errorImg = new URL('../../../../public/error.png', import.meta.url).href

const RoomCover = (item) => {
  const { roomInfo } = item
  const { coverFromUser, keyFrame } = roomInfo
  const cover = <Image
    src={coverFromUser || keyFrame}
    fallback={errorImg}
    preview={false}
  />
  return cover
}
export default RoomCover