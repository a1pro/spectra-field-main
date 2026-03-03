import {colors} from '../Theme/colors';

export const statusColor: any = {
  1: colors.active,
  2: colors.lateCancelled,
  3: colors.complete,
  4: colors.lateShow,
  5: colors.lateCancelled,
};

export const statusTextColor: any = {
  1: colors.activeText,
  2: colors.lateCancelledText,
  3: colors.completeText,
  4: colors.lateShowText,
  5: colors.lateCancelledText,
};

export const statusText: any = {
  1: 'Active',
  2: 'Cancel',
  3: 'Complete',
  4: 'LateShow',
  5: 'Late',
};
