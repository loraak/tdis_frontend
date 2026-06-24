import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Navbar } from "../navbar/navbar";
import { RouterOutlet } from '@angular/router';
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-main-layout',
  imports: [Header, Navbar, RouterOutlet, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
