import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MarketplaceItem {
  id: number;
  title: string;
  category: string;
  price_per_day: number;
  location: string;
  image_url: string;
  rating?: string;
}

export interface BookingPayload {
  item_id: number;
  renter_name: string;
  start_date: string;
  end_date: string;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost/eric';

  getItems(): Observable<MarketplaceItem[]> {
    return this.http.get<MarketplaceItem[]>(`${this.baseUrl}/get_items.php`);
  }

  addItem(payload: Omit<MarketplaceItem, 'id'>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/add_item.php`, payload);
  }

  createBooking(payload: BookingPayload): Observable<{ total_days: number; total_price: number }> {
    return this.http.post<any>(`${this.baseUrl}/create_booking.php`, payload);
  }
}