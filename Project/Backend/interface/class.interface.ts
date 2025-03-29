
interface IClass extends Document {
    className: string;
    session: string;
    timetable?: string | null;
    highScorers?: string | null;
    isActive: number;
  }

  export default IClass;