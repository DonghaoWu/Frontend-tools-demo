match /carts/{cart}{
    allow read, create;
    allow update: if request.auth != null && request.auth.uid == resource.data.userId
}