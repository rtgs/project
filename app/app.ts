import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketplaceService, MarketplaceItem } from './api';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class MarketplaceComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);

  // Core Reactive States
  items = signal<MarketplaceItem[]>([]);
  searchQuery = signal<string>('');
  showItemModal = signal<boolean>(false);
  showBookingModal = signal<boolean>(false);
  selectedItem = signal<MarketplaceItem | null>(null);
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(true);

  // Min Date Constraint picker validation tracking
  todayDate = new Date().toISOString().split('T')[0];

  // Template Form Data Binding Objects
  newItem = { title: '', category: 'Electronics', price_per_day: null as number | null, location: '', image_url: '' };
  bookingData = { renter_name: '', start_date: '', end_date: '' };

  // Reactive Compute Node - Recalculates dynamically whenever items or searchQuery mutations fire
  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.items();
    return this.items().filter(item => item.title.toLowerCase().includes(query));
  });

  ngOnInit(): void {
    this.fetchMarketplaceItems();
  }

  fetchMarketplaceItems(): void {
    this.isLoading.set(true);
    this.marketplaceService.getItems().subscribe({
      next: (data) => {
        this.items.set(data);
        this.errorMessage.set(null);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(`Error communication breakdown (Status: ${err.status || 'Unknown'})`);
        this.isLoading.set(false);
      }
    });
  }

  onAddItemSubmit(): void {
    if (!this.newItem.price_per_day) return;
    
    const payload = {
      title: this.newItem.title,
      category: this.newItem.category,
      price_per_day: this.newItem.price_per_day,
      location: this.newItem.location,
      image_url: this.newItem.image_url
    };

    this.marketplaceService.addItem(payload).subscribe({
      next: (res) => {
        alert(res.message);
        this.showItemModal.set(false);
        this.resetItemForm();
        this.fetchMarketplaceItems();
      }
    });
  }

  openBookingFlow(item: MarketplaceItem): void {
    this.selectedItem.set(item);
    this.showBookingModal.set(true);
  }

  onBookingSubmit(): void {
    const activeItem = this.selectedItem();
    if (!activeItem) return;

    const payload = {
      item_id: activeItem.id,
      renter_name: this.bookingData.renter_name,
      start_date: this.bookingData.start_date,
      end_date: this.bookingData.end_date
    };

    this.marketplaceService.createBooking(payload).subscribe({
      next: (res) => {
        alert(`Success! Rented for ${res.total_days} day(s).\nTotal Charge: $${res.total_price}`);
        this.showBookingModal.set(false);
        this.resetBookingForm();
      },
      error: (err) => {
        alert('Booking Error: ' + (err.error?.message || 'Transaction failed.'));
      }
    });
  }

  resetItemForm(): void {
    this.newItem = { title: '', category: 'Electronics', price_per_day: null, location: '', image_url: '' };
  }

  resetBookingForm(): void {
    this.bookingData = { renter_name: '', start_date: '', end_date: '' };
    this.selectedItem.set(null);
  }
}