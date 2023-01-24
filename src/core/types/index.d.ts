/**
 *  Common types used to represent the domain entities
 */

export interface BaseEntity {
  id: string;
  created_time: Date;
  last_edited_time: Date;
}

export interface WorkingPlan extends BaseEntity {
  created_time: Date;
  last_edited_time: Date;
  Name?: string;
}

export interface Event extends BaseEntity {
  Name?: string;
  Description?: string;
  Duration?: number;
  Active?: boolean;
  Slug?: string;
  WorkingPlans?: WorkingPlan[];
}
