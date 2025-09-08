export interface CierreCaja {
  id: string;
  total: number;
  date: {
    seconds: number;
    nanoseconds: number;
  };
  isActive?: boolean;
}
