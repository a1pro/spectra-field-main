interface Activity {
  id: number | null;
  activity_create_date: string;
  activity_type: string;
  summary: boolean | string;
  user_id: string;
  date_deadline: string;
  activity_status: string;
  task_notes: string;
}

interface Task {
  id: number;
  name: string;
  email_from: string;
  phone: string;
  contact_name: string;
  description: string;
  user_id: number;
  partner_id: number;
  create_date: string;
  assign_hours: number;
  activities: Activity[];
  activityId: any;
}

type LeadData = [string, Task[]];

interface GroupedData {
  [date: string]: Task[];
}

export const transformDataByActivityDate = (
  leads: LeadData[],
): [string, Task[]][] => {
  const groupedByActivityDate: GroupedData = {};

  leads.forEach(([leadDate, tasks]) => {
    tasks.forEach(task => {
      task.activities.forEach(activity => {
        const activityCreateDate = activity?.date_deadline.split(' ')[0] ?? '';

        if (!groupedByActivityDate[activityCreateDate]) {
          groupedByActivityDate[activityCreateDate] = [];
        }

        groupedByActivityDate[activityCreateDate].push({
          ...task,
          activityId: activity.id,
          create_date: activity?.activity_create_date,
          activities: [
            {
              ...activity,
              task_notes: activity?.task_notes
                ? activity?.task_notes?.replace(/<\/?[^>]+(>|$)/g, '')
                : '',
            },
          ],
        });
      });
    });
  });

  return Object.entries(groupedByActivityDate);
};
