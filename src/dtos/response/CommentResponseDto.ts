import {EntityEnum} from "../../enums/entity.enum";

export class CommentResponseDto {
    id: number;
    entity: EntityEnum;
    entityId: number;
    commentTxt: string;
    userId: number;
    userName: string;
    timestamp: Date;
    replies: ReplyResponseDto[];

    constructor(data: any) {
        this.id = data.id;
        this.entity = data.entity;
        this.entityId = data.entityId;
        this.commentTxt = data.commentTxt;
        this.userId = data.userId;
        this.userName = data.userName;
        this.timestamp = data.timestamp;
        this.replies = data.replies;
    }
}

export class ReplyResponseDto {
    id: number;
    commentId: number;
    replyTxt: string;
    userId: number;
    userName: string;
    timestamp: Date;

    constructor(data: any) {
        this.id = data.id;
        this.commentId = data.commentId;
        this.replyTxt = data.replyTxt;
        this.userId = data.userId;
        this.userName = data.userName;
        this.timestamp = data.timestamp;
    }
}
