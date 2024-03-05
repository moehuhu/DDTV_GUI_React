import { Modal, Switch, Form, Skeleton, Space, Card, Button, Popconfirm, Image } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { useUpdateEffect } from "ahooks"
import _ from 'lodash'
import useSetRoom from "../../hooks/useSetRoom"
import { useTranslation } from "react-i18next"
import useRoomInfo from "../../hooks/useRoomInfo"
import useDelRoom from "../../hooks/useDelRoom"
const errorImg = new URL('../../../public/error.png', import.meta.url).href

const SetRoomModal = (props) => {
    const { editingRoom, setEditingRoom, message, refreshPage } = props
    const isOpen = !_.isEmpty(editingRoom)
    const uid = editingRoom?.userInfo?.uid
    const { getRoomByUID, isLoading: isLoadingRoomInfo, roomInfo } = useRoomInfo()
    const [form] = Form.useForm()
    useUpdateEffect(() => {
        uid && getRoomByUID(uid)
    }, [editingRoom])
    useUpdateEffect(() => {
        form.setFieldsValue(roomInfo)
    }, [roomInfo])
    const confirm = () => form.submit()
    const closeModal = (values) => {
        values && form.setFieldsValue(values)
        setEditingRoom?.({})
    }
    const { setRoom, isLoading } = useSetRoom()
    const onFinish = async (values) => {
        const [err] = await setRoom({ ...values, uid })
        if (err) {
            message.error(err?.message)
            return
        }
        message.success('√')
        closeModal(values)
        refreshPage()
    }
    const { deleteRoom } = useDelRoom()
    const handleDelete = async () => {
        const [err] = await deleteRoom(uid)
        if (err) {
            message.error(err?.message)
            return
        }
        closeModal({
            IsRecDanmu: false,
            IsAutoRec: false,
            IsRemind: false
        })
        refreshPage()
    }

    const { t } = useTranslation()
    const cover = <Card>
        <Image
            src={roomInfo?.cover_from_user?.Value || roomInfo?.keyframe?.Value}
            fallback={errorImg}
            preview={false} />
    </Card>
    const roomForm = <Card>
        <Form
            form={form}
            onFinish={onFinish}
            initialValues={roomInfo}>
            <Form.Item label={t('recDanmu')} name={'IsRecDanmu'}>
                <Switch />
            </Form.Item>
            <Form.Item label={t('autoRec')} name={'IsAutoRec'}>
                <Switch />
            </Form.Item>
            <Form.Item label={t('remind')} name={'IsRemind'}>
                <Switch />
            </Form.Item>
        </Form>
    </Card>
    const footer = [
        <Popconfirm
            key={'delete'}
            title={t('Delete the room')}
            description={t('Are you sure to delete this room?')}
            onConfirm={handleDelete}
            okText={t('Confirm')}
            okButtonProps={{ danger: true }}
            showCancel={false}>
            <Button danger type="primary" icon={<DeleteOutlined />} />
        </Popconfirm>,
        <Button key={'cancel'} onClick={closeModal}>{t('Cancel')}</Button>,
        <Button key={'confirm'} type="primary" loading={isLoading} onClick={confirm}>{t('Confirm')}</Button>
    ]

    const modalWrapper = (content) => <Modal
        closeIcon={null}
        open={isOpen}
        footer={footer}
        onOk={confirm}
        mask={false}
        confirmLoading={isLoading}
        className="set-room-modal"
        onCancel={closeModal}>
        <Skeleton loading={isLoadingRoomInfo}>
            <Space direction="vertical">
                {cover}
                {content}
            </Space>
        </Skeleton>
    </Modal>

    return modalWrapper(roomForm)
}
export default SetRoomModal