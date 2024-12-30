import {EntityEnum} from "../../enums/entity.enum";

export class CommentRequestDto {
    entity: EntityEnum;
    commentTxt: string;
    userId: number;
    entityId: number;
    // commentId: number | null;
    constructor(entity: EntityEnum, commentTxt: string, userId: number, entityId: number) {
        this.entity = entity;
        this.commentTxt = commentTxt;
        this.userId = userId;
        this.entityId = entityId;
    }
}

export class ReplyRequestDto {
    replyTxt: string;
    userId: number;
    commentId: number;

    constructor(replyTxt: string, userId: number, commentId: number) {
        this.replyTxt = replyTxt;
        this.userId = userId;
        this.commentId = commentId;
    }
}