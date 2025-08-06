import {
  Permissions,
  PermissionType,
  RoleType,
} from "../constants/role.constant";

export const RolePermissions: Record<RoleType, Array<PermissionType>> = {
  OWNER: [
    Permissions.CREATE_HOUSE,
    Permissions.EDIT_HOUSE,
    Permissions.DELETE_HOUSE,
    Permissions.MANAGE_HOUSE_SETTINGS,

    Permissions.ADD_MEMBER,
    Permissions.CHANGE_MEMBER_ROLE,
    Permissions.REMOVE_MEMBER,

    Permissions.CREATE_CLEANING_TASK,
    Permissions.EDIT_CLEANING_TASK,
    Permissions.DELETE_CLEANING_TASK,

    Permissions.VIEW_ONLY,
  ],
  ADMIN: [
    Permissions.ADD_MEMBER,
    Permissions.MANAGE_HOUSE_SETTINGS,

    Permissions.CREATE_CLEANING_TASK,

    Permissions.VIEW_ONLY,
  ],
  MEMBER: [Permissions.VIEW_ONLY],
};
