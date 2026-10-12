alter table public.vyrdict_email_outbox drop constraint vyrdict_email_outbox_kind_check;
alter table public.vyrdict_email_outbox add constraint vyrdict_email_outbox_kind_check check (kind = any (array[
'newsletter_welcome'::text,'product_request_added'::text,'weekly_digest'::text,
'product_watch_update'::text,'product_request_status'::text,'studio_inquiry'::text
]));