export class GroupEntity {
  id: number;
  name: string;
  invitationToken: string;
  currency: Array<{ id: number; code: string; }>;
  groupPhoto: string;
  members: {
    userId: number;
    name: string;
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
    groupPhoto: string = '',
    invitationToken: string = '',
    currency: { id: number; code: string; }[] = [],
    name: string = '',
    members: { userId: number; name: string; }[] = [],
    createdAt: Date = new Date(),
    paymentHistory: { id: number; date: Date; amount: number; member: { id: number; name: string; } }[] = [],
    expenseHistory: { id: number; date: Date; amount: number; member: { id: number; name: string; } }[] = [],
    isMember: boolean = false
  ) {
    this.id = id;
    this.groupPhoto = groupPhoto;
    this.invitationToken = invitationToken;
    this.currency = currency;
    this.name = name;
    this.members = members;
    this.createdAt = createdAt;
    this.isMember = isMember;
    this.expenseHistory = expenseHistory;
    this.paymentHistory = paymentHistory;
  }
}
