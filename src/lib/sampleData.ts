import { IIntern } from './models/Intern';
import { IMasterTemplate } from './models/MasterTemplate';
import { INTERN_COLORS } from './constants';

export const sampleInterns: IIntern[] = [
  {
    _id: '1',
    name: 'Ali Hassan',
    section: 'A',
    batch: '2023',
    color: INTERN_COLORS[0],
    avatar: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    name: 'Sara Khan',
    section: 'B',
    batch: '2024',
    color: INTERN_COLORS[1],
    avatar: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    name: 'Ahmed Ali',
    section: 'A',
    batch: '2022',
    color: INTERN_COLORS[2],
    avatar: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    name: 'Fatima Sheikh',
    section: 'AI',
    batch: '2023',
    color: INTERN_COLORS[3],
    avatar: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '5',
    name: 'Hassan Malik',
    section: 'DS',
    batch: '2024',
    color: INTERN_COLORS[4],
    avatar: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const sampleMasterTemplates: IMasterTemplate[] = [
  {
    _id: 'template1',
    dayOfWeek: 'Monday',
    timeSlot: '09:00-09:30',
    internIds: ['1', '2', '3'], // 3 interns - should expand
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'template2', 
    dayOfWeek: 'Monday',
    timeSlot: '10:00-10:30',
    internIds: ['4'], // 1 intern
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'template3',
    dayOfWeek: 'Tuesday',
    timeSlot: '09:00-09:30',
    internIds: ['1', '2', '4', '5'], // 4 interns - maximum expansion
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'template4',
    dayOfWeek: 'Wednesday',
    timeSlot: '14:00-14:30',
    internIds: ['2', '3'], // 2 interns
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'template5',
    dayOfWeek: 'Friday',
    timeSlot: '11:00-11:30',
    internIds: ['1', '3', '4'], // 3 interns - should expand
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'template6',
    dayOfWeek: 'Thursday',
    timeSlot: '13:00-13:30',
    internIds: ['1', '2', '3', '4', '5'], // 5 interns - test overflow
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];