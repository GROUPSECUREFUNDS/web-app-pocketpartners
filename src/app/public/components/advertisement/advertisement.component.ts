import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { interval, Subscription } from 'rxjs';
import { AdsService } from '../services/ads.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  standalone: true,
  styleUrls: ['./advertisement.component.css'],
  imports: [CommonModule] // Include CommonModule here
})
export class AdvertisementComponent implements OnInit, OnDestroy {
  ads: { url: string }[] = [];
  currentAdIndex = 0;
  adInterval!: Subscription;

  constructor(private adsService: AdsService) {}

  ngOnInit(): void {
    this.adsService.getAds().subscribe(
      (ads) => {
        this.ads = ads;

        // Start cycling through ads every 10 seconds if there are ads available
        if (this.ads.length > 0) {
          this.startAdRotation();
        }
      },
      (error) => {
        console.error('Failed to load ads:', error);
      }
    );
  }

  startAdRotation(): void {
    this.adInterval = interval(10000).subscribe(() => {
      this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
    });
  }

  ngOnDestroy(): void {
    if (this.adInterval) {
      this.adInterval.unsubscribe();
    }
  }
}
