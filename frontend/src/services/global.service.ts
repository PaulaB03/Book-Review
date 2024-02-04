import { Injectable } from '@angular/core';

export enum ReadingStatus {
  Read = 0,
  Reading = 1,
  WantToRead = 2,
}

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  readingStatusEnum = ReadingStatus;

  constructor() { }
}
