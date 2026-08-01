export enum InstituteType {
  SCHOOL = 'SCHOOL',
  COLLEGE_UNIVERSITY = 'COLLEGE_UNIVERSITY',
  COACHING = 'COACHING',
  TUITION = 'TUITION',
  LANGUAGE_INSTITUTE = 'LANGUAGE_INSTITUTE',
  COMPUTER_IT_INSTITUTE = 'COMPUTER_IT_INSTITUTE',
  SKILL_TRAINING = 'SKILL_TRAINING',
  OTHER = 'OTHER',
}

export type InstituteUiConfig = {
  label: string;
  groupLabel: string;
  scheduleLabel: string;
  assessmentLabel: string;
  progressLabel: string;
  modules: string[];
};

const COMMON = [
  'students',
  'teachers',
  'attendance',
  'fees',
  'notifications',
  'reports',
];

export const INSTITUTE_UI_CONFIG: Record<InstituteType, InstituteUiConfig> = {
  [InstituteType.SCHOOL]: {
    label: 'School',
    groupLabel: 'Class & Section',
    scheduleLabel: 'Timetable',
    assessmentLabel: 'Exams & Marks',
    progressLabel: 'Academic Progress',
    modules: [...COMMON, 'classes', 'sections', 'homework', 'exams'],
  },
  [InstituteType.COLLEGE_UNIVERSITY]: {
    label: 'College / University',
    groupLabel: 'Department & Semester',
    scheduleLabel: 'Class Schedule',
    assessmentLabel: 'Exams & Results',
    progressLabel: 'Academic Progress',
    modules: [...COMMON, 'departments', 'courses', 'semesters', 'exams'],
  },
  [InstituteType.COACHING]: {
    label: 'Coaching',
    groupLabel: 'Batch',
    scheduleLabel: 'Batch Schedule',
    assessmentLabel: 'Tests & Results',
    progressLabel: 'Course Progress',
    modules: [...COMMON, 'courses', 'batches', 'tests', 'assignments'],
  },
  [InstituteType.TUITION]: {
    label: 'Tuition',
    groupLabel: 'Batch',
    scheduleLabel: 'Class Schedule',
    assessmentLabel: 'Tests & Results',
    progressLabel: 'Learning Progress',
    modules: [...COMMON, 'subjects', 'batches', 'tests', 'assignments'],
  },
  [InstituteType.LANGUAGE_INSTITUTE]: {
    label: 'Language Institute',
    groupLabel: 'Level & Batch',
    scheduleLabel: 'Class Schedule',
    assessmentLabel: 'Tests & Results',
    progressLabel: 'Language Progress',
    modules: [...COMMON, 'courses', 'levels', 'batches', 'assignments'],
  },
  [InstituteType.COMPUTER_IT_INSTITUTE]: {
    label: 'Computer / IT Institute',
    groupLabel: 'Course & Batch',
    scheduleLabel: 'Lab / Class Schedule',
    assessmentLabel: 'Tests & Practical',
    progressLabel: 'Course Progress',
    modules: [...COMMON, 'courses', 'batches', 'modules', 'practical'],
  },
  [InstituteType.SKILL_TRAINING]: {
    label: 'Skill / Training Center',
    groupLabel: 'Program & Batch',
    scheduleLabel: 'Training Schedule',
    assessmentLabel: 'Assessment',
    progressLabel: 'Competency Progress',
    modules: [...COMMON, 'programs', 'batches', 'competencies', 'certificates'],
  },
  [InstituteType.OTHER]: {
    label: 'Education / Training Institute',
    groupLabel: 'Class / Batch',
    scheduleLabel: 'Schedule',
    assessmentLabel: 'Assessment',
    progressLabel: 'Learning Progress',
    modules: [...COMMON, 'courses', 'batches', 'assignments', 'assessments'],
  },
};
