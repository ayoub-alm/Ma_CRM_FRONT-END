import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatRipple} from '@angular/material/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GeminiService} from '../../../services/ai.service';
import {BehaviorSubject, tap} from 'rxjs';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatButton,
    MatRipple,
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.css'
})
export class AiChatComponent {
  aiForm!: FormGroup;
  chatHistory: { text: string; type: 'user' | 'ai' }[] = [];
  loading: boolean = false;
  copiedMessageIndex: number | null = null;

  constructor(private fb: FormBuilder, private geminiService: GeminiService) {
    this.aiForm = this.fb.group({
      prompt: ['', Validators.required],
    });
  }

  sendPrompt(): void {
    if (this.aiForm.invalid) return;

    const userMessage = this.aiForm.value.prompt;
    this.chatHistory.push({ text: userMessage, type: 'user' });

    this.aiForm.reset();
    this.loading = true;

    this.geminiService.generateText(userMessage).subscribe({
      next: (res) => {
        this.chatHistory.push({ text: res.response, type: 'ai' });
        this.loading = false;
      },
      error: () => {
        this.chatHistory.push({ text: "Désolé, je n'ai pas pu répondre. Réessayez plus tard.", type: 'ai' });
        this.loading = false;
      }
    });
  }

  formatMessage(text: string): string {
    if (!text) return '';

    return text
      .replace(/\*\*(.*?)\*\*/g, '<h6>$1</h6>')  // Bold text -> H1
      .replace(/\*(.*?)\*/g, '<h6>$1</h6>')      // Italic text -> H3
      .replace(/__(.*?)__/g, '<strong>$1</strong>') // Underline -> Bold
      .replace(/_(.*?)_/g, '<i>$1</i>')          // Italics -> <i>
      .replace(/\n/g, '<br>')                   // New lines -> <br>
      .replace(/- (.*?)(\n|$)/g, '<li>$1</li>')  // Bullet points
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>'); // Wrap list in <ul>
  }

  /**
   *
   * @param text
   * @param index
   */
  copyToClipboard(text: string, index: number): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedMessageIndex = index;
      setTimeout(() => this.copiedMessageIndex = null, 1500); // Reset after 1.5s
    });
  }

}
