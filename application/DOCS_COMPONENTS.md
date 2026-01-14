# תיעוד קומפוננטות הפרויקט

המסמך הזה מסכם לכל קומפוננטה את המטרה (Macro), מי מנהל/משתמש בה, הסטייטים המרכזיים, מתי הם משתנים, אילו פרופס נכנסים ויוצאים, ופירוט מיקרו על פונקציות פנימיות ונקודות חשובות.

---

**ActivePost.jsx**:
- **מטרה:** הצגה וניהול פוסט פעיל (צפייה/קישור לתגובות/עריכה).  
- **מנהל:** נפרש על ידי Route/Parent שמנווט ל`/home/users/:userId/posts/:postId` (משתמש ב`useParams` ו`location.state`).
- **Props נכנסים:** אין props ישירות; מקבל `location.state` עם `{ post, isPostOwner, currentUserEmail }`.  
- **Props יוצאים/Callbacks:** משתמש ב־`useApi("posts")` ל־`deletePost` ו־`updateItem` (side-effects).  
- **State:** `post` (נשמר מה־location.state), `showContent` (בקרת תצוגה), `editingPost` (עריכה זמנית).  
- **מתי משתנים:** `post` מתעדכן אחרי `updateItem`; `editingPost` משתנה כשפותחים טופס עריכה; `showContent` לפי כפתור הצגה/הסתרה.  
- **פונקציות פנימיות חשובות:** `renderEdit(editData,setEditData)` — מחזיר JSX טופס עריכה קטן; שימוש ב־`updateItem` ב־onUpdate של `GenericItem`.  
- **מחזיר:** מבנה JSX עם `GenericItem`, כפתור לנווט ל־comments (Link) ו־`<Outlet/>`.  
- **הערה:** מסתמך על `location.state` — יש לוודא שהניווט מעביר אותו; לא עושה fetch אם אין state.

**AdditionalUserInformation.jsx**:
- **מטרה:** שלב טופס הרחבה בהרשמה (שדות כתובת, חברה וכו').
- **מנהל:** מי שקורא ל־component הרשמה (`Register`).
- **Props נכנסים:** `onSubmit(formData)` callback.
- **State:** אין פנימי — רק מגדיר `fields` ומעביר ל`DynamicForm`.
- **פונקציות פנימיות:** אין — כל הלוגיקה ב־`DynamicForm`.
- **מחזיר:** `DynamicForm` עם שדות מוגדרים.

**AlbumItem.jsx**:
- **מטרה:** תצוגה/עריכה/מחיקה של אלבום יחיד.
- **מנהל:** מוצג בתוך `AlbumsList` (route: `/home/users/:userId/albums`).
- **Props נכנסים:** `album`, `deleteItem`, `updateItem`, `isOwner`.
- **State:** אין מקומי חוץ מ־`useParams` לקריאת `userId`.
- **פונקציות פנימיות:** `renderView(item)` ו־`renderEdit(editData,setEditData)` המועברות ל־`GenericItem`.
- **מחזיר:** עטיפה ו־`GenericItem` עם view/edit מותאמים.

**AlbumsList.jsx**:
- **מטרה:** רשימת אלבומים של משתמש; תמיכה בחיפוש ויצירת אלבום.
- **מנהל:** route `/home/users/:userId/albums`.
- **State:** `searchBy`, `searchValue`, `showCreateForm`.  
- **מתי משתנים:** `searchBy`/`searchValue` לפי `SearchFilter`; `showCreateForm` לפי כפתור; `albums` מתעדכן על ידי `useApi.getItems` ב־useEffect.
- **Props/Callbacks:** משתמש ב־`useApi('albums')` שמספק `{ data: albums, getItems, deleteItem, updateItem, addItem }`.
- **פונקציות פנימיות:** `handleCreateAlbum(formData)` שנקרא מ־`DynamicForm` ומפעיל `addItem`.
- **מחזיר:** כפתורי חיפוש/יצירה, `SearchFilter`, רשימת `AlbumItem`.

**BasicUserInformation.jsx**:
- **מטרה:** שלב בסיסי בטופס הרשמה — שם משתמש וסיסמה.
- **מנהל:** `Register`.
- **Props נכנסים:** `onSubmit`.
- **State:** אין — שולח שדות ל־`DynamicForm`.

**CommentItem.jsx**:
- **מטרה:** הצגת תגובה ויכולת לערוך/למחוק אם הבעלים.
- **מנהל:** `CommentsList` עבור תגובה אחת.
- **Props נכנסים:** `comment`, `onDelete`, `onUpdate`, `currentUserEmail`.
- **State:** אין — משתמש ב־`GenericItem` לניהול עריכה מקומית (state ב־GenericItem).
- **פונקציות פנימיות:** `renderView`, `renderEdit` — מכתיבות מה יוצג ומתי עוברים לעריכה.

**CommentsList.jsx**:
- **מטרה:** טעינת תגובות לפוסט, הצגה והוספת תגובות חדשות.
- **מנהל:** בדרך כלל חלק מ־`ActivePost` או route המשנה.
- **Props נכנסים:** `postId`, `currentUserEmail` (ברירת מחדל מוגדרת).
- **State:** `showAddForm` מקומי.
- **מתי משתנים:** ב־useEffect קורא `getItems({ postId })` כש־`postId` משתנה; `showAddForm` לפי כפתור.
- **פונקציות פנימיות:** `handleAddComment(formData)` שמריץ `addItem(...)` ומשנה `showAddForm` ל־false.

**DynamicForm.jsx**:
- **מטרה:** קומפוננטה כללית של טופס דינמי (שדות מרשימה), משמשת בכל פרויקט.
- **מנהל:** מקובל להוביל על ידי קומפוננטת הורה שמעבירה `fields` ו־`onSubmit`.
- **Props:** `fields` (array של שדות), `onSubmit(formData)`, `submitButtonText`.
- **State:** `formData` — אובייקט מפתחות לפי `fields`.
- **פונקציות פנימיות:** `handleChange(e)` — מעדכן `formData`; `handleSubmit(e)` — קורא `onSubmit` ואפס שדות.
- **הערה:** מאתחל כל שדה למחרוזת ריקה; לא מבצע ולידציות מעבר ל־`required` HTML.

**GenericItem.jsx**:
- **מטרה:** מעטפת לשימוש חוזר להצגה/עריכה/מחיקה של פריט אחד; מרכז לוגיקה עריכה ושמירה.
- **מנהל:** נקרא מכל רכיב פריט (PostItem, AlbumItem, TodoItem, וכו.).
- **Props נכנסים:** `item`, `onDelete(id)`, `onUpdate(id,data)`, `renderView(item)`, `renderEdit(editData,setEditData)`, `canEdit`.
- **State:** `isEditing`, `editData` (עותק מקומי של `item`).
- **פונקציות פנימיות:** `handleSave()` — קורא `onUpdate(editData.id, editData)`; `handleCancel()` — מאפס ויוצא מעריכה.
- **הערה:** הנחייה חשובה — הורה צריך לספק `onUpdate` שמטפל בעדכון בצד השרת/חיבור ל־useApi.

**GetItems.jsx**:
- **מטרה:** דוגמה/קומפוננטה ניסיונית שמדגימה קריאה ל־API; בגרסה פעילה משתמש ב־`useApi` ומציג `resource` מה־URL.
- **מנהל:** מוגבל/ניסיוני; עשוי להיות לא בשימוש ב־routes.
- **Props:** אין; משתמש ב־`useParams()` ל־`userId, resource`.
- **הערה:** מחזיר רשימה פשוטה של כותרות מהנתונים שמוחזרים על ידי ה־Hook.

**home.jsx**:
- **מטרה:** דף בית של משתמש עם קישורים ל־Albums/Posts/Todos/Info/Logout.
- **מנהל:** route `/home/users/:userId` (מכיל `Outlet`).
- **State:** קריאת פרטי משתמש מ־`localStorage` עבור `userId`.
- **פונקציות פנימיות:** אין מורכבות — רק רינדור קישורים.

**LogIn.jsx**:
- **מטרה:** טופס התחברות; בודק משתמש באמצעות `useApi('users').getItems` ומאחסן פרטי משתמש ב־localStorage.
- **State/Fields:** מטופל ע"י `DynamicForm` (שדות: `userName`, `password`).
- **מתי משתנה:** אחרי `getItems` — אם נמצא משתמש מתקיימת ניווט עם `navigate` ושמירה ב־localStorage.
- **הערה:** משתמש ב`website` כדוגמה לשדה סיסמה.

**LogOut.jsx**:
- **מטרה:** מבצע התנתקות — מסיר פרטי משתמש מה־localStorage ומנווט ל־`/login` אחרי הצגת הודעת הצלחה.
- **State:** `showSuccessMessage` כדי להציג חיווי לפני ניווט.
- **פונקציות פנימיות:** `handleLogout()` — מבצע הסרה ו־setTimeout ל־ניווט; `handleCancel()` — חוזר אחורה.

**PhotoItem.jsx**:
- **מטרה:** הצגת תמונה/תמונת מיני; טיפול בטעינת תמונה נכשלת.
- **Props:** `photo`, `deleteItem`, `updateItem`.
- **State:** `imageError` — מטפל ב־onError של תגית `img`.
- **פונקציות פנימיות:** `handleDelete(id)` — שואל אישור לפני מחיקה.
- **מחזיר:** `GenericItem` עם `renderView` שמציג תמונה ופרטים.

**PhotosList.jsx**:
- **מטרה:** רשימת תמונות באלבום; pagination פשוט ויכולת הוספה.
- **State:** `currentPage`, `photosPerPage`, `showAddForm`.
- **מתי משתנה:** useEffect טוען תמונות על שינוי `albumId`; `currentPhotos` מחושב מתוך `photos`.
- **פונקציות פנימיות:** `handleAddPhoto(formData)` קורא `addItem` עם `albumId` ואז סוגר את הטופס.

**PostItem.jsx**:
- **מטרה:** הצגת פוסט בודד; עריכת כותרת אינליין למחיקה.
- **Props:** `post`, `isPostOwner`, `deletePost`, `updatePost`, `currentUserEmail`.
- **State:** `editingTitle` — אובייקט זמני לעריכה של הכותרת.
- **פונקציות פנימיות:** `saveTitle()` — קורא `updatePost` ושומר שינויים.

**Posts.jsx**:
- **מטרה:** רשימת פוסטים של משתמש; תמיכה בסינון (הפוסטים שלי/אחרים) וחיפוש.
- **State:** `searchBy`, `searchValue`, `showMyPosts`.
- **מתי משתנה:** useEffect מבצע `getItems` לפי מצבי סינון/חיפוש.
- **Props/Callbacks:** משתמש ב־`useApi('posts')` לקבלת `posts`, `deleteItem`, `updateItem`.

**Register.jsx**:
- **מטרה:** תהליך הרשמה דו־שלבי: `BasicUserInformation` → `AdditionalUserInformation` → יצירת משתמש חדש.
- **State:** `step`, `error`, `basicData`.
- **פונקציות פנימיות:** `handleBasicSubmit(formData)` — בודק סיסמאות ומשתמשים קיימים; `handleFinalSubmit(formData)` — מרכיב את אובייקט המשתמש ומבצע `addItem` ואז שומר ב־localStorage ומנווט.

**SearchFilter.jsx**:
- **מטרה:** קומפוננטת עזר לשדות חיפוש: בורר קריטריון ושליחת ערך חיפוש.
- **Props:** `searchOptions`, `searchBy`, `setSearchBy`, `searchValue`, `setSearchValue`.

**ShowUserInformation.jsx**:
- **מטרה:** מציג נתוני משתמש מתוך `localStorage` לפי `userId` (כולל Address/Company).
- **State:** `userDetails`, `error`.
- **פונקציות פנימיות:** `InfoField` — רכיב קטן להצגת שדה אם קיים.

**SortDropdown.jsx**:
- **מטרה:** קומפוננטת עזר לסינון/מיון.
- **Props:** `sortOptions`, `sortBy`, `setSortBy`.

**TodoItem.jsx**:
- **מטרה:** הצגה/עריכה/מחיקה של משימה.
- **Props:** `todo`, `onDelete`, `onUpdate`.
- **State:** מטופל ב־`GenericItem` (edit state שם).

**Todos.jsx**:
- **מטרה:** רשימת מטלות של משתמש עם מיון וחיפוש, ותצוגה של `TodoItem` לכל פריט.
- **State:** `sortBy`, `searchBy`, `searchValue`.
- **מתי משתנה:** useEffect מפעיל `getItems` לפי `userId`, `sortBy`, `searchBy`, `searchValue`.

---

הערות כלליות ונקודות חשובות:
- `useApi` הוא ה־hook המרכזי לתקשורת עם ה־backend; תלויות רבות ממתינות ל־response של ה־hook. יש לוודא ש־`useApi` מחזיר קונסיסטנטית את `{ data, getItems, addItem, updateItem, deleteItem }` כפי שמשתמשים בקוד.
- `GenericItem` הוא המקום שמרכז את לוגיקת העריכה; הורים חייבים להעביר `onUpdate` ו־`onDelete` שעושים side-effects נכונים (עדכון/מחיקה בשרת/Hook).
- `DynamicForm` מטפל בכניסת ערכים פשוטה — אם דרושות ולידציות מורכבות יש להרחיב אותה.
- ניווטים המשתמשים ב־`location.state` (למשל `ActivePost`) תלויים בכך שהקישור שולח את ה־state; אם משתמשים ב־גישה ישירה ל־URL, יש לטעון את הנתונים מחדש.
- יש רכיבים שמכילים קוד שמוקם כתגובות מקומיות (תגובות) — יש לוודא שאין שימוש ב־`any` או in-place mutation של props.

אפשרויות המשך (הצעתי):
- הוספת JSDoc/PropTypes בכל קובץ — אוסיף אוטומטית תגובות אם רוצים.
- המרת התיעוד ל־JSON/TypeScript types כדי לאפשר בדיקות סטטיות.

אם תרצה, אוסיף inline תיעוד בתוך הקבצים עצמם (JSDoc) או אבנה גרסה מקוצרת עבור README.
