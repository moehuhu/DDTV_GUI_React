export enum Opcode {
  /// 读取配置文件
  ReadingConfigurationFile = 10101,
  /// 更新到配置文件
  UpdateToConfigurationFile = 10102,
  /// 读取房间文件
  ReadingRoomFiles = 10103,
  /// 更新到房间文件
  UpdateToRoomFile = 10104,
  /// 修改配置
  ModifyConfiguration = 10105,

  /// 新增房间配置成功
  SuccessfullyAddedRoom = 20101,
  /// 新增房间配置失败
  FailedToAddRoomConfiguration = 20102,
  /// 修改房间录制配置
  ModifyRoomRecordingConfiguration = 20103,
  /// 修改房间弹幕配置
  ModifyRoomBulletScreenConfiguration = 20104,
  /// 修改房间提示配置
  ModifyRoomPromptConfiguration = 20105,
  /// 手动触发录制任务
  ManuallyTriggeringRecordingTasks = 20106,
  /// 删除房间成功
  SuccessfullyDeletedRoom = 20107,
  /// 删除房间失败
  FailedToDeleteRoom = 20108,
  /// 取消录制成功
  CancelRecordingSuccessful = 20109,
  /// 取消录制失败
  CancelRecordingFail = 20110,
  /// 触发快剪成功
  SuccessfullyTriggeredQuickCut = 20111,
  /// 触发快剪失败
  TriggerQuickCutFail = 20112,
  /// 新增录制任务成功
  SuccessfullyAddedRecordingTask = 20113,
  /// 新增录制任务失败
  FailedToAddRecordingTask = 20114,

  /// 用户同意协议
  UserConsentAgreement = 30101,
  /// 用户未同意协议
  UserDoesNotAgreeToAgreement = 30102,
  /// 触发重新登陆
  TriggerLoginAgain = 30103,
  /// 登陆成功
  LoginSuccessful = 30104,
  /// 更新登录态缓存
  UpdateLoginStateCache = 30105,
  /// 登录态失效
  InvalidLoginStatus = 30106,
  /// 扫码登陆确认
  ScanCodeConfirmation = 30107,
  /// 二维码等待扫码
  QrCodeWaitingForScann = 30108,
  /// 已扫码等待确认
  ScannedCodeWaitingForConfirmation = 30109,

  /// 保存弹幕相关文件
  SaveBulletScreenFile = 40101,
  /// 触发开播事件
  StartLiveEvent = 40102,
  /// 开播提醒
  StartBroadcastingReminder = 40103,
  /// 开始录制
  StartRecording = 40104,
  /// 录制结束
  RecordingEnd = 40105,
  /// 停止直播事件
  StopLiveEvent = 40106,
  /// 录制触发重新连接
  Reconnect = 40107,
  /// HLS任务成功开始
  HlsTaskStart = 40108,
  /// FLV任务成功开始
  FlvTaskStart = 40109,
}
export default Opcode