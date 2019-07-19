const getPermissionUsersData = arrayOfUsers =>
  arrayOfUsers.map(
    ({
      username,
      firstName,
      surName,
      middleName,
      image,
      permission,
      _id: id
    }) => ({
      username,
      firstName,
      surName,
      image,
      middleName,
      permission,
      permissionId: id,
      id
    })
  );

const serializePermission = (prevPermission, nextPermissions) => ({
  chat: {
    C:
      nextPermissions.chat &&
      (nextPermissions.chat.C || nextPermissions.chat.C === false)
        ? nextPermissions.chat.C
        : prevPermission.chat.C,
    R:
      nextPermissions.chat &&
      (nextPermissions.chat.R || nextPermissions.chat.R === false)
        ? nextPermissions.chat.R
        : prevPermission.chat.R,
    U:
      nextPermissions.chat &&
      (nextPermissions.chat.U || nextPermissions.chat.U === false)
        ? nextPermissions.chat.U
        : prevPermission.chat.U,
    D:
      nextPermissions.chat &&
      (nextPermissions.chat.D || nextPermissions.chat.D === false)
        ? nextPermissions.chat.D
        : prevPermission.chat.D
  },
  news: {
    C:
      nextPermissions.news &&
      (nextPermissions.news.C || nextPermissions.news.C === false)
        ? nextPermissions.news.C
        : prevPermission.news.C,
    R:
      nextPermissions.news &&
      (nextPermissions.news.R || nextPermissions.news.R === false)
        ? nextPermissions.news.R
        : prevPermission.news.R,
    U:
      nextPermissions.news &&
      (nextPermissions.news.U || nextPermissions.news.U === false)
        ? nextPermissions.news.U
        : prevPermission.news.U,
    D:
      nextPermissions.news &&
      (nextPermissions.news.D || nextPermissions.news.D === false)
        ? nextPermissions.news.D
        : prevPermission.news.D
  },
  setting: {
    C:
      nextPermissions.setting &&
      (nextPermissions.setting.C || nextPermissions.setting.C === false)
        ? nextPermissions.setting.C
        : prevPermission.setting.C,
    R:
      nextPermissions.setting &&
      (nextPermissions.setting.R || nextPermissions.setting.R === false)
        ? nextPermissions.setting.R
        : prevPermission.setting.R,
    U:
      nextPermissions.setting &&
      (nextPermissions.setting.U || nextPermissions.setting.U === false)
        ? nextPermissions.setting.U
        : prevPermission.setting.U,
    D:
      nextPermissions.setting &&
      (nextPermissions.setting.D || nextPermissions.setting.D === false)
        ? nextPermissions.setting.D
        : prevPermission.setting.D
  }
});

module.exports = {
  getPermissionUsersData,
  serializePermission
};
