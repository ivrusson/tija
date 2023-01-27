export type NotionRequestParent = {
  type: 'database_id';
  database_id: string;
};

export function fieldToParent(value: string): NotionRequestParent {
  return {
    type: 'database_id',
    database_id: value,
  };
}

export type NotionRequestTitleType = {
  title: [
    {
      text: {
        content: string;
      };
    }
  ];
};

export function fieldToTitle(value: string): NotionRequestTitleType {
  return {
    title: [
      {
        text: {
          content: value,
        },
      },
    ],
  };
}

export type NotionRequestRichTextType = {
  rich_text: [
    {
      text: {
        content: string;
      };
    }
  ];
};

export function fieldToRichText(value: string): NotionRequestRichTextType {
  return {
    rich_text: [
      {
        text: {
          content: value,
        },
      },
    ],
  };
}

export type NotionRequestSelectType = {
  select: {
    name: string;
  };
};

export function fieldToSelect(value: string): NotionRequestSelectType {
  return {
    select: {
      name: value,
    },
  };
}

export type NotionRequestNumberType = {
  number: number;
};

export function fieldToNumber(value: number | string): NotionRequestNumberType {
  return {
    number: typeof value === 'string' ? parseFloat(value) : value,
  };
}


export type NotionRequestStatusType = {
  status: {
    name: string;
  };
};

export function fieldToStatus(value: string): NotionRequestStatusType {
  return {
    status: {
      name: value,
    },
  };
}

export type NotionRequestEmailType = {
  email: string;
};

export function fieldToEmail(value: string): NotionRequestEmailType {
  return {
    email: value,
  };
}

export type NotionRequestPhoneType = {
  phone_number: string;
};

export function fieldToPhone(value: string): NotionRequestPhoneType {
  return {
    phone_number: value,
  };
}

export type NotionRequestDate = {
  date: {
    start: string;
    end?: string;
    time_zone?: string;
  };
};

export function fieldToDate(value: {
  start: string;
  end?: string;
  time_zone?: string;
}): NotionRequestDate {
  return {
    date: value,
  };
}

export type NotionSingleRelation = {
  id: string;
};

export type NotionRequestRelationType = {
  relation: NotionSingleRelation[];
};

export function fieldToRelations(
  values: NotionSingleRelation[]
): NotionRequestRelationType {
  return {
    relation: values,
  };
}

export const toNotionFields = {
  date: fieldToDate,
  parent: fieldToParent,
  title: fieldToTitle,
  rich_text: fieldToRichText,
  number: fieldToNumber,
  select: fieldToSelect,
  status: fieldToStatus,
  email: fieldToEmail,
  phone: fieldToPhone,
  relations: fieldToRelations,
};
