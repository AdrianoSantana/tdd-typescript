export interface AddSurvey {
    add(data: AddSurveyModel): Promise<void>
}

export interface SurveyAnswer {
    image: string
    answer: string
}

export interface AddSurveyModel {
    question: string
    answers: SurveyAnswer[]
}