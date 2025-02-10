export type File = {
    id: string;
    name: string;
    type: string;
    path: string;
}

export type NewFile = {
    name: string,
    type: string,
    base64: string,
    id: string,
}

export type RemovedFile = {
    id: string;
}

export const FileSelectArgs = {
    select: {
        id: true,
        name: true,
        path: true,
        type: true,
    }
}

export type Assignment = {
    id: string;
    title: string;
    instructions: string;
    createdAt: Date | null;
    dueDate: Date | null;
    attachments: File[];
    teacher: { id: string; username: string };
    section: { id: string; name: string } | null;

    // @note: temporary
    submitted: boolean;
    late: boolean;
    returned: boolean;
}   

export type Class = {
    id: string;
    name: string;
    subject: string;
    section: number;
    teachers: { id: string; username: string }[];
    students: { id: string; username: string }[];
    // assignments: {
    //     id: string;
    //     title: string;
    //     instructions: string;
    //     createdAt: Date | null;
    //     dueDate: Date | null;
    //     attachments: File[];
    //     teacher: { id: string; username: string };
    //     section: { id: string; name: string } | null;
    // }[];
    assignments: Assignment[];
    sections: { id: string; name: string }[];
};

export type Submission = {
    id: string;
    submitted: boolean | null;
    submittedAt: Date | null;
    returned: boolean | null;
    late?: boolean | null; // @todo: fix - hindsight i forgot what
    attachments: File[];
    assignment: {
        dueDate: Date | null;
        id: string;
        title: string;
    };
    annotations: File[];
    student: {
        id: string;
        username: string;
    };
};


export type GetAssignmentResponse = {
    assignmentData: Assignment;
    classId: string;
};

export type CreateUpdateAnnotationRequest = {
    removedAttachments: RemovedFile[];
    newAttachments: NewFile[];
    return: boolean
}

export type UpdateAssignmentRequest = {
    id: string;
    title: string;
    instructions: string;
    dueDate: Date | null;
    newAttachments: NewFile[];
    removedAttachments: RemovedFile[];
    section?: { id: string } | null;
};

export type DeleteAssignmentRequest = {
    id: string;
};

export const SubmissionSelectArgs = {
    id: true,
    submitted: true,
    submittedAt: true,
    returned: true,
    annotations: {
        ...FileSelectArgs,
    },
    attachments: {
        ...FileSelectArgs,
    },
    assignment: {
        select: {
            dueDate: true,
            id: true,
            title: true,
        }
    },
    student: {
        select: {
            id: true,
            username: true,
        },
    }
}

export type GetClassesResponse = {
    teacherInClass: Array<{
        id: string;
        name: string;
        section: number;
        subject: string;
        dueToday: Array<{
            id: string;
            title: string;
            dueDate: Date;
        }>;
    }>;
    studentInClass: Array<{
        id: string;
        name: string;
        section: number;
        subject: string;
        dueToday: Array<{
            id: string;
            title: string;
            dueDate: Date;
        }>;
    }>;

};

export type CreateClassRequest = {
    name: string;
    section: string;
    subject: string;
};

export type CreateClassResponse = {
    newClass: {
        id: string;
        name: string;
        section: number;
        subject: string;
    };
};

export type UpdateClassRequest = {
    id: string;
    name: string;
    section: string;
    subject: string;
};

export type UpdateClassResponse = {
    updatedClass: {
        id: string;
        name: string;
        section: number;
        subject: string;
    };
};


export type JoinClassRequest = {
    code: string;
};


export type GetClassResponse = { 
    classData: Class; 
}

export type CreateSectionRequest = {
    name: string;
};

export type UpdateSectionRequest = {
    id: string;
    name: string;
    classId: string;
};

export type DeleteSectionRequest = {
    id: string;
    classId: string;
};

export type ClassInviteResponse = {
    session: {
        id: string;
    }
}

export type MemberRequest = {
    id: string;
    type: 'teacher' | 'student';
};

export type CreateAssignmentRequest = {
    title: string;
    instructions: string;
    dueDate: Date;
    files: NewFile[];
    sectionId?: string;
};

export type GetSubmissionResponse =  {
    submissionData: Submission;
}