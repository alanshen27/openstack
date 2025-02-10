

export interface AssignmentCreateBodyProps {
    attachments:  {
        id: string,
        type: string,
        name: string,
        base64: string
    }[];
    sectionId?: string; // section ID 
    dueDate: Date;
    instructions: string;
    title: string;
}

export interface AttachmentGetBodyProps {
    name: string,
    id: string,
    path: string,
    type: string,
}

export interface AssignmentGetBodyProps {
    id: string,
    title: string,
    instructions: string,
    dueDate: string,
    createdAt: string,
    section: {
        id: string,
        name: string,
    }
    teacher: {
        id: string,
        username: string,
    },
    attachments: AttachmentGetBodyProps[],
}

export interface SubmissionCreateBodyProps {
    attachments: AttachmentGetBodyProps[],
    annotations: AttachmentGetBodyProps[],
    submitted: boolean,
    returned: boolean,
    student: {
        id: string,
        username: string,
    },
    newAttachments: {
        id: string,
        type: string,
        name: string,
        base64: string
    }[],
    removedAttachments: {
        id: string,
    }[],
}

export interface SubmissionGetBodyProps {
    id: string,
    attachments: AttachmentGetBodyProps[],
    annotations: AttachmentGetBodyProps[],
    submitted: boolean,
    student: {
        id: string,
        username: string,
    },
}

export interface AssignmentEditBodyProps {
    id: string,
    title: string,
    instructions: string,
    dueDate: string,
    attachments: AttachmentGetBodyProps[],
    sections: {
        id: string,
        name: string,
    }[],
    section: {
        id: string,
        name?: string,
    }, // section ID
    removedAttachments: {
        id: string,
    }[],
    newAttachments: {
        id: string,
        type: string,
        name: string,
        base64: string,
    }[],
}

export interface SubmissionCreateBodyProps {
    attachments: AttachmentGetBodyProps[],
}

export interface ClassGetBodyProps {
    id: string,
    name: string,
    section: number,
    subject: string,
    assignments: AssignmentGetBodyProps[],
}