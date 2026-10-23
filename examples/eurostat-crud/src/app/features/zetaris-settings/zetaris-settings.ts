import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ZetarisConnectionService,
  type ZetarisConnection,
} from '../../core/zetaris/zetaris-connection.service';
import { ZetarisService } from '../../core/zetaris/zetaris.service';

@Component({
  selector: 'app-zetaris-settings',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './zetaris-settings.html',
  styleUrl: './zetaris-settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZetarisSettings implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  readonly connection = inject(ZetarisConnectionService);
  private readonly zetaris = inject(ZetarisService);

  readonly form = this.formBuilder.nonNullable.group({
    basePath: [
      '/zetaris-api',
      [Validators.required, Validators.pattern(/^(?:\/|https?:\/\/)\S*$/)],
    ],
    orgId: ['1', [Validators.required, Validators.pattern(/^\S+$/)]],
    apiKey: [''],
  });

  readonly saving = signal(false);
  readonly testing = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly configured = this.connection.configured;

  ngOnInit(): void {
    const connection = this.connection.connection();
    if (connection) {
      this.form.patchValue({
        basePath: connection.basePath,
        orgId: connection.orgId,
      });
    }
  }

  save(): void {
    this.resetFeedback();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const connection = this.currentConnection();
    if (!connection) {
      this.error.set('Enter the Zetaris API key.');
      return;
    }

    this.saving.set(true);

    try {
      this.connection.save(connection);
      this.zetaris.clearCache();
      this.form.controls.apiKey.reset('');
      this.message.set('Connection saved for this browser tab.');
    } catch (error) {
      this.error.set(
        error instanceof Error ? error.message : 'Could not save the Zetaris connection.',
      );
    } finally {
      this.saving.set(false);
    }
  }

  async test(): Promise<void> {
    this.resetFeedback();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const connection = this.currentConnection();
    if (!connection) {
      this.error.set('Enter the Zetaris API key.');
      return;
    }

    this.testing.set(true);

    try {
      await this.zetaris.testConnection(connection);
      this.message.set('Connection works: Zetaris accepted the API key and ran SELECT 1.');
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Could not reach Zetaris.');
    } finally {
      this.testing.set(false);
    }
  }

  disconnect(): void {
    this.connection.clear();
    this.zetaris.clearCache();
    this.form.reset({ basePath: '/zetaris-api', orgId: '1', apiKey: '' });
    this.message.set('Connection cleared from this browser tab.');
    this.error.set(null);
  }

  private currentConnection(): ZetarisConnection | null {
    const value = this.form.getRawValue();
    const existing = this.connection.connection();
    const apiKey = value.apiKey.trim() || existing?.apiKey || '';

    if (!apiKey) {
      return null;
    }

    return {
      basePath: value.basePath.trim(),
      orgId: value.orgId.trim(),
      apiKey,
    };
  }

  private resetFeedback(): void {
    this.message.set(null);
    this.error.set(null);
  }
}
