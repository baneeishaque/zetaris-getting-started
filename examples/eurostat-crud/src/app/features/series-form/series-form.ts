import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  GEO_CODES,
  SEX_CODES,
  type GeoCode,
  type SavedSeriesInput,
  type SexCode,
} from '../../core/series/saved-series.model';
import { SeriesStoreService } from '../../core/series/series-store.service';
import { GEO_LABELS, SEX_LABELS } from '../../core/series/series-labels';

@Component({
  selector: 'app-series-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './series-form.html',
  styleUrl: './series-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeriesForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(SeriesStoreService);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80), Validators.pattern(/\S/)]],
    geo: ['PL' as GeoCode, Validators.required],
    sex: ['T' as SexCode, Validators.required],
    note: ['', [Validators.maxLength(2000)]],
  });

  readonly geoOptions = GEO_CODES;
  readonly sexOptions = SEX_CODES;
  readonly geoLabels = GEO_LABELS;
  readonly sexLabels = SEX_LABELS;

  readonly editing = signal(false);
  readonly notFound = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly saving = signal(false);

  private seriesId: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.seriesId = id;
    this.editing.set(true);

    const record = this.store.series().find((item) => item.id === id);
    if (!record) {
      this.notFound.set(true);
      return;
    }

    this.form.setValue({
      name: record.name,
      geo: record.filters.geo,
      sex: record.filters.sex,
      note: record.note,
    });
  }

  submit(): void {
    this.submitError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    try {
      const value = this.form.getRawValue();
      const input: SavedSeriesInput = {
        name: value.name.trim(),
        note: value.note.trim(),
        filters: {
          geo: value.geo,
          sex: value.sex,
        },
      };
      const record = this.seriesId
        ? this.store.update(this.seriesId, input)
        : this.store.create(input);

      if (!record) {
        this.submitError.set('This saved series no longer exists.');
        return;
      }

      void this.router.navigate(['/series', record.id]);
    } catch (error) {
      this.submitError.set(error instanceof Error ? error.message : 'Could not save this series.');
    } finally {
      this.saving.set(false);
    }
  }

  cancel(): void {
    if (this.seriesId) {
      void this.router.navigate(['/series', this.seriesId]);
    } else {
      void this.router.navigate(['/series']);
    }
  }
}
