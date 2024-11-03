export class GroupEntity {
  id: number;
  name: string;
  groupPhoto: string;
  description: string;
  adminId: number;
  members: {
    userId: number;
    fullName: string;
    joinedAt: Date;
    role: string;
  }[];
  isMember: boolean;
  createdAt: Date;
  expenseHistory: {
    id: number;
    date: Date;
    amount: number;
    member: {
      id: number;
      name: string;
    };
  }[];
  paymentHistory: {
    id: number;
    date: Date;
    amount: number;
    member: {
      id: number;
      name: string;
    };
  }[];

  constructor(
    id: number = 0,
    adminId: number = 0,
    name: string = '',
    groupPhoto: string ='',
    description: string = '',
    members: { userId: number; fullName: string; joinedAt: Date; role: string; }[] = [],
    createdAt: Date = new Date(),
    paymentHistory: { id: number; date: Date; amount: number; member: { id: number; name: string; } }[] = [],
    expenseHistory: { id: number; date: Date; amount: number; member: { id: number; name: string; } }[] = [],
    isMember: boolean = false
  ) {
    this.id = id;
    this.groupPhoto = groupPhoto;
    this.description = description;
    this.name = name;
    this.adminId = adminId;
    this.members = members;
    this.createdAt = createdAt;
    this.isMember = isMember;
    this.expenseHistory = expenseHistory;
    this.paymentHistory = paymentHistory;
  }
}
