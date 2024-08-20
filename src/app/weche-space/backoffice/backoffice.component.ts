import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../portail/menu-connexion/models/user";
import {TokenStorageService} from "../portail/menu-connexion/services/token-storage.service";
import {Router} from "@angular/router";
import {environment} from "../../../environment/environment";
import {WebsocketService} from "../../shared/services/websocket.service";
import {first, interval, Subscription, takeUntil} from "rxjs";
import {NotificationsService} from "../../shared/services/notifications.service";
import {Notifications} from "../../shared/models/notifications";

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css']
})
export class BackofficeComponent implements OnInit, OnDestroy {
  isSidebarActive = false;
  isShowNav = false;
  isContentActive = false;
  user!: User;
  message!: string;
  notifications!: Notifications[];
  intervalSubscription!: Subscription
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  private unsubscribe: Subscription[] = [];

  /**
   * Constructor for the class.
   *
   * @param {TokenStorageService} tokenStorageService - Service for storing and retrieving tokens.
   * @param {Router} router - Service for navigating to different routes.
   * @param {WebsocketService} service - Service for handling websocket connections.
   * @param {NotificationsService} notificationService - Service for handling notifications.
   */
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private service: WebsocketService,
    private notificationService: NotificationsService
  ) {
  }

  /**
   * Clean up subscriptions and interval subscription.
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribe.forEach((subscription) => subscription.unsubscribe());

    // Add interval subscription to unsubscribe array
    this.unsubscribe.push(this.intervalSubscription);
  }

  /**
   * Initialize component.
   */
  ngOnInit(): void {
    // Retrieve notifications
    this.getNotifications();

    // Get user information from token
    this.user = this.tokenStorageService.getUserInfoByToken();

    // List unread notifications for the user
    this.listUnread();

    // Set up interval to periodically check for unread notifications
    this.intervalSubscription = interval(300).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.listUnread();
    });
  }


  /**
   * Logout the user and navigate to the login page.
   */
  logout(): void {
    // Remove token from local storage
    localStorage.removeItem(this.authLocalStorageToken);

    // Navigate to login page
    this.router.navigate(['/connexion'], {
      queryParams: {},
    });

    // Reload the page
    window.location.reload();
  }


  /**
   * Toggle the sidebar and update the state of other variables.
   */
  toggleSidebar(): void {
    // Toggle the sidebar active state
    this.isSidebarActive = !this.isSidebarActive;

    // Toggle the show nav state
    this.isShowNav = !this.isShowNav;

    // Toggle the content active state
    this.isContentActive = !this.isContentActive;
  }

  /**
   * Read a notification and update the list of unread notifications.
   *
   * @param {string} id - The ID of the notification to read.
   */
  protected readNotification(id: string): void {
    // Read the notification
    const subscription = this.notificationService.readNotification(id)
      .pipe(first())
      .subscribe((response) => {
        // If the response is truthy, update the list of unread notifications
        if (response) {
          this.listUnread();
        }
      });

    // Add the subscription to the unsubscribe array
    this.unsubscribe.push(subscription);
  }

  /**
   * Get notifications by subscribing to the '/topic/notification' topic.
   */
  private getNotifications(): void {
    const subscription = this.service.watch('/topic/notification')
      .subscribe((message) => {
        console.log(message.body);
        // this.receivedMessages.push(message.body);
      });

    // Add the subscription to the unsubscribe array
    this.unsubscribe.push(subscription);
  }

  /**
   * List unread notifications.
   */
  private listUnread(): void {
    const subscription = this.notificationService.listUnread()
      .pipe(first())
      .subscribe((response) => {
        this.notifications = response;
      });

    // Add the subscription to the unsubscribe array
    this.unsubscribe.push(subscription);
  }


}
