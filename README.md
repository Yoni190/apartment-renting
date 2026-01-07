# apartment-renting

# Tour Statuses

# 1. Pending
Tour request submitted by a client and awaiting owner action. Owner either accepts or rejects the request

# 2. Approved
Tour request accepted/approved by the owner and scheduled for the selected date and time.

# 3. Cancellation Requested
Client has requested to cancel an approved tour less than 24 hours before the scheduled time and requires owner review.

# 4. Cancelled
Tour has been successfully cancelled and is no longer active.
Client can cancel a pending tour request anytime. 
If a cancellation request is approved/accepted by the owner, it's status becomes cancelled as well.

# 5. Completed
Tour(approved/accepted tour) took place as scheduled and was completed successfully.

# 6. No Show
Tour was approved, but the client did not attend at the scheduled time.

# 7. Rejected
Tour request was declined by the property owner.


### Cancellation Rules

Pending tours can be canceled directly by the client at any time.

Approved tours follow time-based cancellation rules:
≥ 24 hours before the tour: client can cancel directly.
< 24 hours before the tour: client must submit a cancellation request.

Cancellation requests require owner review:
If approved, the tour is marked Cancelled.
If declined, the tour remains Approved and absence may be marked as No Show.


### Post-Tour Rules

After the scheduled tour time:
Owners must mark approved tours as Completed or No Show.

### Tours marked as Canceled, Completed, No Show, or Rejected are final and cannot be modified.

## Validation & Enforcement

- Only future date-time slots (including later today) can be booked.

- Past or expired tour slots are automatically removed from availability on the tour request panel.
