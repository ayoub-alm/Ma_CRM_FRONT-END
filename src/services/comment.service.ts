import { Injectable } from '@angular/core';

import {Observable, tap} from "rxjs";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import { CommentResponseDto } from '../dtos/response/CommentResponseDto';
import { CommentRequestDto, ReplyRequestDto } from '../dtos/request/CreateCommentDto';
import {EntityEnum} from "../enums/entity.enum";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly baseUrl: string = environment.baseUrl;
  private readonly commentApiUrl: string = `${this.baseUrl}/api/comments`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches comments for a specific entity and entity ID.
   * @param entity
   * @param entityId
   */
  getCommentsByEntityAndEntityId(entity: EntityEnum, entityId: number): Observable<CommentResponseDto[]> {
    return this.http.get<CommentResponseDto[]>(
        `${this.commentApiUrl}?entity=${entity}&entityId=${entityId}`
    ).pipe(tap((response: CommentResponseDto[]) => {
      response.map((comment: CommentResponseDto) => {new CommentResponseDto(comment)})
    }));
  }

  /**
   * Adds a new comment to an entity.
   * @param commentRequest
   */
  addComment(commentRequest: CommentRequestDto): Observable<CommentResponseDto> {
    return this.http.post<CommentResponseDto>(`${this.commentApiUrl}`, commentRequest).pipe(
        tap((response: CommentResponseDto) => {
      new CommentResponseDto(response)
    }));
  }

  /**
   * Adds a reply to an existing comment.
   * @param replyRequest
   */
  addReply(replyRequest: ReplyRequestDto): Observable<CommentResponseDto> {
    return this.http.post<CommentResponseDto>(`${this.commentApiUrl}/reply`, replyRequest).pipe(
        tap((response: CommentResponseDto) => {new CommentResponseDto(response)})
    );
  }

  /**
   * Deletes a comment by its ID.
   * @param commentId
   */
  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.commentApiUrl}/${commentId}`);
  }

  /**
   * Edits an existing comment by its ID.
   * @param commentId
   * @param updatedText
   */
  editComment(commentId: number, updatedText: string): Observable<CommentResponseDto> {
    return this.http.put<CommentResponseDto>(`${this.commentApiUrl}/${commentId}`, {
      text: updatedText,
    });
  }
}
