import { Feedback } from "src/database/dabaseModels/feedbacks.entity";


export const FeedbackProviders = [
    {
        provide: 'FEEDBACK_REPOSITORY',
        useValue: Feedback,
    },
];