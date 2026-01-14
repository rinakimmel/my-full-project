# תיעוד מפורט ומקיף - React Application

## תוכן עניינים
1. [useApi Hook - ליבת התקשורת](#useapi-hook)
2. [App.jsx - ניתוב ראשי](#appjsx)
3. [קומפוננטות ליבה](#core-components)
4. [קומפוננטות רשימות](#list-components)
5. [קומפוננטות פריטים](#item-components)
6. [קומפוננטות טפסים](#form-components)
7. [קומפוננטות עזר](#utility-components)
8. [זרימת נתונים ומצבים](#data-flow)

---

## useApi Hook

### מטרה כללית (Macro)
Hook מותאם אישית שמנהל את כל התקשורת עם ה-API. זהו הלב של ניהול הנתונים באפליקציה - כל קומפוננטה שצריכה לתקשר עם השרת משתמשת ב-Hook הזה.

### פרמטרי קלט
```javascript
const { data, getItems, deleteItem, updateItem, addItem } = useApi(resource);
```
- **resource** (string): שם המשאב ב-API
  - אפשרויות: `"users"`, `"posts"`, `"comments"`, `"todos"`, `"albums"`, `"photos"`
  - דוגמה: `useApi("posts")` יתקשר עם `http://localhost:3000/posts`

### State פנימי
```javascript
const [data, setData] = useState([]);
```
- **data** (array): מערך של כל הפריטים שהתקבלו מהשרת
- **מתי משתנה**: 
  - אחרי `getItems()` - מתעדכן עם כל הנתונים מהשרת
  - אחרי `deleteItem(id)` - מסנן את הפריט שנמחק
  - אחרי `updateItem(id, data)` - מעדכן את הפריט הספציפי
  - אחרי `addItem(newItem)` - מוסיף פריט חדש לסוף המערך

### פונקציות מוחזרות

#### 1. getItems(params = {})
**מטרה**: שליפת נתונים מהשרת עם אפשרות לסינון

**פרמטרים**:
- `params` (object, אופציונלי): אובייקט של query parameters
  - דוגמאות:
    ```javascript
    getItems({ userId: 5 })                    // ?userId=5
    getItems({ userId: 5, _sort: 'title' })   // ?userId=5&_sort=title
    getItems({ title: 'test' })                // ?title=test
    getItems({ userId_ne: 3 })                 // ?userId_ne=3 (not equal)
    ```

**תהליך פנימי**:
1. שולח GET request ל-`${BASE_URL}/${resource}` עם params
2. מקבל response מהשרת
3. קורא `setData(response.data)` - מעדכן את ה-state
4. מחזיר את הנתונים (Promise)

**טיפול בשגיאות**:
```javascript
catch (error) {
    console.error("Error fetching data:", error);
    return [];  // מחזיר מערך ריק במקרה של שגיאה
}
```

**שימוש טיפוסי**:
```javascript
useEffect(() => {
    getItems({ userId: userId });
}, [userId, getItems]);
```

**הערות חשובות**:
- עטוף ב-`useCallback` עם dependency על `resource`
- לא זורק שגיאה - רק מדפיס ל-console
- מחזיר מערך ריק אם יש שגיאה (לא null או undefined)

#### 2. deleteItem(id)
**מטרה**: מחיקת פריט מהשרת ומה-state המקומי

**פרמטרים**:
- `id` (number/string): מזהה הפריט למחיקה

**תהליך פנימי**:
1. שולח DELETE request ל-`${BASE_URL}/${resource}/${id}`
2. מעדכן state מיד (אופטימיסטי):
   ```javascript
   setData(prev => prev.filter(item => item.id !== id))
   ```
3. אם השרת נכשל, ה-state כבר השתנה (אין rollback)

**דוגמת שימוש**:
```javascript
<button onClick={() => deleteItem(post.id)}>מחק</button>
```

**התנהגות אופטימיסטית**:
- היתרון: UI מגיב מיד, חוויית משתמש מהירה
- החיסרון: אם השרת נכשל, המידע נעלם מה-UI אבל עדיין קיים בשרת

#### 3. updateItem(id, updateFields)
**מטרה**: עדכון חלקי (PATCH) של פריט קיים

**פרמטרים**:
- `id` (number/string): מזהה הפריט
- `updateFields` (object): רק השדות שצריך לעדכן
  - דוגמה: `{ title: 'New Title' }` - יעדכן רק את ה-title

**תהליך פנימי**:
1. שולח PATCH request ל-`${BASE_URL}/${resource}/${id}` עם `updateFields`
2. מקבל את הפריט המעודכן המלא מהשרת
3. מעדכן את ה-state:
   ```javascript
   setData(prev => prev.map(item =>
       item.id === id ? response.data : item
   ))
   ```

**דוגמאות שימוש**:
```javascript
// עדכון כותרת בלבד
updateItem(5, { title: 'כותרת חדשה' });

// עדכון מספר שדות
updateItem(5, { 
    title: 'כותרת חדשה',
    body: 'תוכן חדש'
});

// עדכון מצב completed
updateItem(3, { completed: true });
```

**הערות**:
- משתמש ב-PATCH ולא PUT (עדכון חלקי, לא החלפה מלאה)
- מחליף את הפריט ב-state עם התגובה מהשרת (לא עם updateFields)
- אם השרת מחזיר שדות נוספים, הם יתעדכנו גם כן

#### 4. addItem(newItem)
**מטרה**: יצירת פריט חדש בשרת

**פרמטרים**:
- `newItem` (object): אובייקט עם כל השדות הנדרשים
  - דוגמה:
    ```javascript
    {
        title: 'פוסט חדש',
        body: 'תוכן הפוסט',
        userId: 5
    }
    ```

**תהליך פנימי**:
1. שולח POST request ל-`${BASE_URL}/${resource}` עם `newItem`
2. השרת מחזיר את הפריט עם `id` שנוצר
3. מוסיף את הפריט החדש ל-state:
   ```javascript
   setData(prev => [...prev, response.data])
   ```
4. מחזיר את הפריט החדש (Promise)

**דוגמת שימוש**:
```javascript
const handleCreate = async () => {
    const newPost = await addItem({
        title: 'כותרת',
        body: 'תוכן',
        userId: parseInt(userId)
    });
    console.log('נוצר פוסט עם ID:', newPost.id);
};
```

**הערות**:
- הפריט מתוסף לסוף המערך (לא בהתחלה)
- אם צריך מיון, יש לקרוא `getItems` מחדש
- מחזיר את הפריט המלא כולל ה-id שנוצר

### קבועים
```javascript
const BASE_URL = "http://localhost:3000";
```
- כתובת השרת המקומי
- משתמש ב-json-server
- לשנות לפרודקשן: `process.env.REACT_APP_API_URL`

### useCallback Dependencies
כל הפונקציות עטופות ב-`useCallback` עם `[resource]` כ-dependency:
```javascript
const getItems = useCallback(async (params = {}) => {
    // ...
}, [resource]);
```

**למה?**
- מונע יצירה מחדש של הפונקציות בכל render
- חשוב ל-useEffect dependencies
- אם `resource` משתנה, הפונקציות נוצרות מחדש

### דוגמת שימוש מלאה
```javascript
function Posts() {
    const { userId } = useParams();
    const { data: posts, getItems, deleteItem, updateItem, addItem } = useApi("posts");
    
    useEffect(() => {
        getItems({ userId: userId });
    }, [userId, getItems]);
    
    const handleDelete = (id) => {
        if (confirm('בטוח?')) {
            deleteItem(id);
        }
    };
    
    const handleUpdate = (id, newTitle) => {
        updateItem(id, { title: newTitle });
    };
    
    const handleAdd = async () => {
        const newPost = await addItem({
            title: 'פוסט חדש',
            body: 'תוכן',
            userId: parseInt(userId)
        });
        alert(`נוצר פוסט ${newPost.id}`);
    };
    
    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <button onClick={() => handleUpdate(post.id, 'כותרת חדשה')}>
                        ערוך
                    </button>
                    <button onClick={() => handleDelete(post.id)}>
                        מחק
                    </button>
                </div>
            ))}
            <button onClick={handleAdd}>הוסף פוסט</button>
        </div>
    );
}
```

### בעיות ידועות ושיפורים אפשריים
1. **אין loading state** - לא יודעים מתי הנתונים נטענים
2. **אין error state** - שגיאות רק ב-console
3. **אין retry mechanism** - אם נכשל, צריך לרענן ידנית
4. **מחיקה אופטימיסטית** - אין rollback אם השרת נכשל
5. **אין caching** - כל קריאה ל-getItems שולחת request חדש

---

## App.jsx

### מטרה כללית (Macro)
קומפוננטת השורש שמגדירה את כל מבנה הניתוב (routing) של האפליקציה. זהו המקום היחיד שמכיר את כל המסלולים והקומפוננטות.

### Imports
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
```
- **BrowserRouter**: עוטף את כל האפליקציה, מאפשר routing
- **Routes**: מכיל את כל ה-Route components
- **Route**: מגדיר מסלול בודד
- **Navigate**: מבצע redirect

### מבנה Routing מלא

#### שורש האפליקציה
```javascript
<Route path="/" element={<Navigate to="/logIn" replace />} />
```
- **מטרה**: redirect אוטומטי מ-`/` ל-`/logIn`
- **replace**: מחליף את ההיסטוריה (לא מוסיף entry חדש)
- **מתי מופעל**: כשניגשים ל-`http://localhost:5173/`

#### Authentication Routes
```javascript
<Route path="/logIn" element={<LogIn />} />
<Route path="/register" element={<Register />} />
```
- **לא מוגנים**: כל אחד יכול לגשת
- **אין route guards**: אפשר לגשת גם אם כבר מחובר

#### Home Route (Parent)
```javascript
<Route path="/home/users/:userId" element={<Home />}>
```
- **:userId**: פרמטר דינמי - מזהה המשתמש
- **דוגמה**: `/home/users/5`
- **Home component**: מכיל `<Outlet />` שמציג את ה-nested routes

#### Nested Routes (Children של Home)

##### 1. Logout
```javascript
<Route path="logout" element={<LogOut />} />
```
- **URL מלא**: `/home/users/:userId/logout`
- **מטרה**: אישור והתנתקות

##### 2. User Info
```javascript
<Route path="info" element={<ShowUserInformation />} />
```
- **URL מלא**: `/home/users/:userId/info`
- **מטרה**: הצגת פרטי משתמש מלאים

##### 3. Todos
```javascript
<Route path="todos" element={<Todos />} />
```
- **URL מלא**: `/home/users/:userId/todos`
- **מטרה**: רשימת מטלות

##### 4. Posts (Parent)
```javascript
<Route path="posts" element={<Posts />} />
```
- **URL מלא**: `/home/users/:userId/posts`
- **מטרה**: רשימת פוסטים

##### 5. Active Post (Nested בתוך Posts)
```javascript
<Route path="posts/:postId" element={<ActivePost />}>
    <Route path="comments" element={<CommentsList />} />
</Route>
```
- **URL מלא**: `/home/users/:userId/posts/:postId`
- **עם תגובות**: `/home/users/:userId/posts/:postId/comments`
- **ActivePost**: מכיל `<Outlet />` לתגובות
- **מעבר state**: דרך `location.state`

##### 6. Albums (Parent)
```javascript
<Route path="albums" element={<AlbumsList />} />
```
- **URL מלא**: `/home/users/:userId/albums`
- **מטרה**: רשימת אלבומים

##### 7. Photos (Nested בתוך Albums)
```javascript
<Route path="albums/:albumId" element={<PhotosList />} />
```
- **URL מלא**: `/home/users/:userId/albums/:albumId`
- **מטרה**: תמונות של אלבום ספציפי

### מבנה היררכי מלא
```
/
├─ /logIn
├─ /register
└─ /home/users/:userId (Home + Outlet)
    ├─ logout
    ├─ info
    ├─ todos
    ├─ posts (Posts)
    ├─ posts/:postId (ActivePost + Outlet)
    │   └─ comments (CommentsList)
    ├─ albums (AlbumsList)
    └─ albums/:albumId (PhotosList)
```

### דוגמאות ניווט

#### מ-LogIn ל-Home
```javascript
navigate(`/home/users/${userId}`);
```

#### מ-Posts ל-ActivePost עם state
```javascript
<Link 
    to={`/home/users/${userId}/posts/${post.id}`}
    state={{ post, isPostOwner, currentUserEmail }}
>
    {post.title}
</Link>
```

#### מ-ActivePost ל-Comments
```javascript
<Link to="comments" state={{ post, isPostOwner, currentUserEmail }}>
    הצג תגובות
</Link>
```

#### מ-Albums ל-Photos
```javascript
<Link to={`/home/users/${userId}/albums/${album.id}`}>
    {album.title}
</Link>
```

### בעיות ידועות
1. **אין route guards**: אפשר לגשת ל-`/home/users/999` בלי התחברות
2. **אין 404 page**: URL לא קיים לא מטופל
3. **userId לא מאומת**: אפשר לגשת לנתונים של כל משתמש
4. **state passing**: אם ניגשים ישירות ל-URL, אין state

### שיפורים מומלצים
```javascript
// Protected Route Component
function ProtectedRoute({ children }) {
    const { userId } = useParams();
    const user = localStorage.getItem(userId);
    
    if (!user) {
        return <Navigate to="/logIn" replace />;
    }
    
    return children;
}

// שימוש:
<Route 
    path="/home/users/:userId" 
    element={
        <ProtectedRoute>
            <Home />
        </ProtectedRoute>
    }
>
```

---


## קומפוננטות ליבה (Core Components)

### GenericItem.jsx

#### מטרה כללית (Macro)
קומפוננטה גנרית לשימוש חוזר שמנהלת את מצב התצוגה/עריכה של פריט בודד. זוהי קומפוננטה מרכזית שמשמשת את כמעט כל קומפוננטות הפריטים (PostItem, TodoItem, CommentItem, וכו').

#### Props מפורטים

##### item (object, required)
```javascript
item: {
    id: number | string,  // חובה - משמש למחיקה ועדכון
    ...otherFields         // שדות נוספים לפי סוג הפריט
}
```
- **דוגמאות**:
  ```javascript
  // Post
  { id: 1, title: 'כותרת', body: 'תוכן', userId: 5 }
  
  // Todo
  { id: 2, title: 'משימה', completed: false, userId: 5 }
  
  // Comment
  { id: 3, name: 'שם', email: 'test@test.com', body: 'תגובה', postId: 1 }
  ```

##### onDelete (function, required)
```javascript
onDelete: (id: number | string) => void
```
- **מטרה**: callback שנקרא כשלוחצים "מחק"
- **פרמטר**: מקבל את `item.id`
- **דוגמה**:
  ```javascript
  <GenericItem
      item={post}
      onDelete={(id) => {
          if (confirm('בטוח?')) {
              deleteItem(id);
          }
      }}
  />
  ```

##### onUpdate (function, required)
```javascript
onUpdate: (id: number | string, data: object) => void
```
- **מטרה**: callback שנקרא כשלוחצים "שמור" אחרי עריכה
- **פרמטרים**:
  - `id`: מזהה הפריט
  - `data`: האובייקט המעודכן המלא (כולל שדות שלא השתנו)
- **דוגמה**:
  ```javascript
  <GenericItem
      item={todo}
      onUpdate={(id, data) => {
          updateItem(id, { 
              title: data.title, 
              completed: data.completed 
          });
      }}
  />
  ```

##### renderView (function, required)
```javascript
renderView: (item: object) => JSX.Element
```
- **מטרה**: פונקציה שמחזירה את ה-JSX להצגה רגילה (לא עריכה)
- **פרמטר**: מקבל את `item` המקורי
- **דוגמה**:
  ```javascript
  const renderView = (item) => (
      <>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          <span>ID: {item.id}</span>
      </>
  );
  ```

##### renderEdit (function, required)
```javascript
renderEdit: (editData: object, setEditData: function) => JSX.Element
```
- **מטרה**: פונקציה שמחזירה את ה-JSX לעריכה
- **פרמטרים**:
  - `editData`: עותק מקומי של item (state)
  - `setEditData`: פונקציה לעדכון editData
- **דוגמה**:
  ```javascript
  const renderEdit = (editData, setEditData) => (
      <>
          <input 
              value={editData.title}
              onChange={(e) => setEditData({ 
                  ...editData, 
                  title: e.target.value 
              })}
          />
          <textarea 
              value={editData.body}
              onChange={(e) => setEditData({ 
                  ...editData, 
                  body: e.target.value 
              })}
          />
      </>
  );
  ```

##### canEdit (boolean, optional, default: true)
```javascript
canEdit: boolean
```
- **מטרה**: קובע אם להציג כפתורי עריכה/מחיקה
- **שימוש**: בדיקת בעלות
- **דוגמה**:
  ```javascript
  <GenericItem
      item={comment}
      canEdit={comment.email === currentUserEmail}
      // ...
  />
  ```

#### State פנימי

##### isEditing (boolean)
```javascript
const [isEditing, setIsEditing] = useState(false);
```
- **מטרה**: מצב נוכחי - תצוגה או עריכה
- **ערכים**:
  - `false`: מצב תצוגה רגיל (view mode)
  - `true`: מצב עריכה (edit mode)
- **מתי משתנה**:
  - `false → true`: לחיצה על כפתור "ערוך"
  - `true → false`: לחיצה על "שמור" או "ביטול"

##### editData (object)
```javascript
const [editData, setEditData] = useState(item);
```
- **מטרה**: עותק מקומי של item לעריכה זמנית
- **אתחול**: מקבל את `item` בהתחלה
- **מתי משתנה**:
  - כשמשנים ערכים בטופס העריכה (דרך `setEditData`)
  - כשלוחצים "ביטול" - חוזר לערך המקורי של `item`
- **חשוב**: השינויים ב-`editData` לא משפיעים על `item` עד שלוחצים "שמור"

#### פונקציות פנימיות

##### handleSave()
```javascript
const handleSave = () => {
    onUpdate(editData.id, editData);
    setIsEditing(false);
};
```
**תהליך**:
1. קורא ל-`onUpdate` עם ה-id וכל ה-editData
2. מחזיר למצב תצוגה (`isEditing = false`)

**הערות**:
- לא מחכה לתגובה מהשרת (לא async)
- מניח שהעדכון יצליח
- אם השרת נכשל, המצב ישתנה ל-view אבל הנתונים לא יתעדכנו

**שיפור מומלץ**:
```javascript
const handleSave = async () => {
    try {
        await onUpdate(editData.id, editData);
        setIsEditing(false);
    } catch (error) {
        alert('שגיאה בשמירה');
    }
};
```

##### handleCancel()
```javascript
const handleCancel = () => {
    setEditData(item);
    setIsEditing(false);
};
```
**תהליך**:
1. מאפס את `editData` לערך המקורי של `item`
2. חוזר למצב תצוגה

**הערות**:
- כל השינויים שנעשו נמחקים
- אין אישור למשתמש ("בטוח שרוצה לבטל?")

#### לוגיקת Render

##### מצב עריכה (isEditing === true)
```javascript
{isEditing ? (
    <div>
        {renderEdit(editData, setEditData)}
        <button onClick={handleSave}>שמור</button>
        <button onClick={handleCancel}>ביטול</button>
    </div>
) : (
    // ...
)}
```
- מציג את תוצאת `renderEdit`
- מוסיף כפתורי "שמור" ו-"ביטול"
- `editData` ו-`setEditData` מועברים ל-renderEdit

##### מצב תצוגה (isEditing === false)
```javascript
{isEditing ? (
    // ...
) : (
    <div>
        {renderView(item)}
        {canEdit && (
            <div>
                <button onClick={() => setIsEditing(true)}>ערוך</button>
                <button onClick={() => onDelete(item.id)}>מחק</button>
            </div>
        )}
    </div>
)}
```
- מציג את תוצאת `renderView`
- אם `canEdit === true`, מציג כפתורי עריכה/מחיקה
- כפתור "ערוך" משנה ל-`isEditing = true`
- כפתור "מחק" קורא ל-`onDelete(item.id)`

#### זרימת עבודה מלאה

```
[מצב תצוגה]
    ↓ לחיצה על "ערוך"
    ↓ setIsEditing(true)
[מצב עריכה]
    ↓ שינוי ערכים
    ↓ setEditData({ ...editData, field: newValue })
    ↓
    ├─→ לחיצה על "שמור"
    │   ↓ onUpdate(editData.id, editData)
    │   ↓ setIsEditing(false)
    │   └─→ [מצב תצוגה] (עם נתונים מעודכנים)
    │
    └─→ לחיצה על "ביטול"
        ↓ setEditData(item) - איפוס
        ↓ setIsEditing(false)
        └─→ [מצב תצוגה] (נתונים מקוריים)
```

#### דוגמת שימוש מלאה

```javascript
function TodoItem({ todo, onDelete, onUpdate }) {
    // הגדרת renderView
    const renderView = (item) => (
        <>
            <p>ID: {item.id}</p>
            <span>{item.title}</span>
            <label>
                <input type="checkbox" checked={item.completed} readOnly />
                {item.completed ? 'הושלם' : 'לא הושלם'}
            </label>
        </>
    );
    
    // הגדרת renderEdit
    const renderEdit = (editData, setEditData) => (
        <>
            <input 
                type='text' 
                placeholder='עדכן כותרת' 
                value={editData.title}
                onChange={(e) => setEditData({ 
                    ...editData, 
                    title: e.target.value 
                })}
            />
            <label>
                <input 
                    type="checkbox" 
                    checked={editData.completed}
                    onChange={(e) => setEditData({ 
                        ...editData, 
                        completed: e.target.checked 
                    })}
                />
                הושלם
            </label>
        </>
    );
    
    return (
        <div style={{ border: '1px solid black', padding: '10px' }}>
            <GenericItem
                item={todo}
                onDelete={onDelete}
                onUpdate={onUpdate}
                renderView={renderView}
                renderEdit={renderEdit}
            />
        </div>
    );
}
```

#### בעיות ידועות

1. **אין loading state בזמן שמירה**
   ```javascript
   // שיפור:
   const [isSaving, setIsSaving] = useState(false);
   
   const handleSave = async () => {
       setIsSaving(true);
       await onUpdate(editData.id, editData);
       setIsSaving(false);
       setIsEditing(false);
   };
   ```

2. **אין אישור למחיקה**
   ```javascript
   // שיפור:
   <button onClick={() => {
       if (confirm('בטוח שרוצה למחוק?')) {
           onDelete(item.id);
       }
   }}>מחק</button>
   ```

3. **editData לא מתעדכן אם item משתנה מבחוץ**
   ```javascript
   // שיפור:
   useEffect(() => {
       if (!isEditing) {
           setEditData(item);
       }
   }, [item, isEditing]);
   ```

4. **אין טיפול בשגיאות**
   - אם `onUpdate` נכשל, המצב משתנה ל-view אבל הנתונים לא
   - צריך try-catch ו-error state

---

### DynamicForm.jsx

#### מטרה כללית (Macro)
טופס דינמי גנרי שיוצר שדות input אוטומטית לפי תיאור. משמש בכל מקום שצריך טופס: הרשמה, התחברות, יצירת פוסט, הוספת תגובה, וכו'.

#### Props מפורטים

##### fields (array, required)
```javascript
fields: Array<{
    name: string,           // שם השדה (key ב-formData)
    placeholder: string,    // טקסט placeholder
    type?: string,          // סוג input (default: "text")
    required?: boolean      // האם שדה חובה (default: false)
}>
```

**דוגמאות**:
```javascript
// טופס התחברות פשוט
const fields = [
    { name: "username", placeholder: "שם משתמש", required: true },
    { name: "password", placeholder: "סיסמה", type: "password", required: true }
];

// טופס יצירת פוסט
const fields = [
    { name: "title", placeholder: "כותרת", required: true },
    { name: "body", placeholder: "תוכן", required: true }
];

// טופס עם שדות אופציונליים
const fields = [
    { name: "name", placeholder: "שם", required: true },
    { name: "email", placeholder: "אימייל", type: "email", required: true },
    { name: "phone", placeholder: "טלפון" },  // לא חובה
    { name: "website", placeholder: "אתר" }   // לא חובה
];
```

##### onSubmit (function, required)
```javascript
onSubmit: (formData: object) => void
```
- **מטרה**: callback שנקרא כששולחים את הטופס
- **פרמטר**: אובייקט עם כל הערכים
- **דוגמה**:
  ```javascript
  const handleSubmit = (formData) => {
      console.log(formData);
      // { username: "test", password: "123456" }
  };
  
  <DynamicForm 
      fields={fields}
      onSubmit={handleSubmit}
  />
  ```

##### submitButtonText (string, optional, default: "Submit")
```javascript
submitButtonText: string
```
- **מטרה**: טקסט כפתור השליחה
- **דוגמאות**: "התחבר", "הירשם", "שלח", "צור", "הוסף"

#### State פנימי

##### formData (object)
```javascript
const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
);
```

**אתחול**:
- עובר על כל ה-fields
- יוצר אובייקט עם key לכל שדה
- מאתחל כל ערך למחרוזת ריקה `''`

**דוגמה**:
```javascript
// אם fields = [
//     { name: "username", ... },
//     { name: "password", ... }
// ]

// אז formData מאותחל ל:
{
    username: '',
    password: ''
}
```

**מתי משתנה**:
- כל פעם שמקלידים בשדה → `handleChange`
- אחרי submit → מתאפס לערכים ריקים

#### פונקציות פנימיות

##### handleChange(e)
```javascript
const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};
```

**תהליך**:
1. מקבל event מה-input
2. שולף `name` (שם השדה) ו-`value` (הערך החדש)
3. מעדכן רק את השדה הספציפי ב-formData

**דוגמה**:
```javascript
// formData לפני: { username: '', password: '' }
// משתמש מקליד "test" ב-username
// formData אחרי: { username: 'test', password: '' }
```

**הערות**:
- משתמש ב-spread operator `...prev` כדי לשמור שדות אחרים
- עובד עם כל סוג input (text, password, email, וכו')

##### handleSubmit(e)
```javascript
const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
};
```

**תהליך**:
1. `e.preventDefault()` - מונע רענון דף (התנהגות default של form)
2. קורא ל-`onSubmit` עם ה-formData הנוכחי
3. מאפס את כל השדות למחרוזות ריקות

**הערות**:
- מאפס תמיד, גם אם `onSubmit` נכשל
- אין בדיקת ולידציה מעבר ל-`required` של HTML
- אין feedback למשתמש (success/error)

#### לוגיקת Render

```javascript
return (
    <form onSubmit={handleSubmit}>
        {fields.map((field) => (
            <input
                key={field.name}
                name={field.name}
                type={field.type || "text"} 
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={!!field.required} 
            />
        ))}
        <button type="submit">{submitButtonText || "Submit"}</button>
    </form>
);
```

**פירוט**:
1. **form onSubmit**: קורא ל-handleSubmit
2. **fields.map**: יוצר input לכל שדה
3. **key={field.name}**: ייחודי לכל input (חשוב ל-React)
4. **name={field.name}**: משמש ב-handleChange לזיהוי השדה
5. **type={field.type || "text"}**: ברירת מחדל "text"
6. **value={formData[field.name] || ''}**: controlled component
7. **onChange={handleChange}**: מעדכן state בכל שינוי
8. **required={!!field.required}**: המרה ל-boolean

#### Controlled vs Uncontrolled

הטופס הזה הוא **Controlled Component**:
```javascript
value={formData[field.name] || ''}
onChange={handleChange}
```

**משמעות**:
- React שולט בערך השדה (לא ה-DOM)
- כל שינוי עובר דרך state
- אפשר לשנות/לאמת ערכים לפני שהם מוצגים

**לעומת Uncontrolled**:
```javascript
// לא נכון - uncontrolled
<input name="username" />

// נכון - controlled
<input 
    name="username" 
    value={formData.username} 
    onChange={handleChange} 
/>
```

#### דוגמאות שימוש

##### טופס התחברות
```javascript
function LogIn() {
    const navigate = useNavigate();
    const { getItems } = useApi("users");
    
    const fields = [
        { name: "userName", placeholder: "שם משתמש", required: true },
        { name: "password", placeholder: "סיסמה", type: "password", required: true }
    ];
    
    const handleSubmit = async (formData) => {
        const users = await getItems({ username: formData.userName });
        if (users.length > 0 && users[0].website === formData.password) {
            localStorage.setItem(users[0].id, JSON.stringify(users[0]));
            navigate(`/home/users/${users[0].id}`);
        } else {
            alert('שם משתמש או סיסמה שגויים');
        }
    };
    
    return (
        <DynamicForm 
            fields={fields}
            onSubmit={handleSubmit}
            submitButtonText="התחבר"
        />
    );
}
```

##### טופס הוספת תגובה
```javascript
function CommentsList({ postId }) {
    const { addItem } = useApi("comments");
    const [showForm, setShowForm] = useState(false);
    
    const handleAddComment = (formData) => {
        addItem({
            name: "My Comment",
            email: currentUserEmail,
            postId: parseInt(postId),
            body: formData.body
        });
        setShowForm(false);
    };
    
    return (
        <div>
            <button onClick={() => setShowForm(!showForm)}>
                הוסף תגובה
            </button>
            
            {showForm && (
                <DynamicForm 
                    fields={[
                        { name: 'body', placeholder: 'תוכן התגובה...', type: 'text' }
                    ]}
                    onSubmit={handleAddComment}
                    submitButtonText="שלח תגובה"
                />
            )}
        </div>
    );
}
```

##### טופס עם שדות רבים
```javascript
function AdditionalUserInformation({ onSubmit }) {
    const fields = [
        { name: "name", placeholder: "שם מלא", required: true },
        { name: "email", placeholder: "אימייל", type: "email", required: true },
        { name: "street", placeholder: "רחוב", required: true },
        { name: "suite", placeholder: "דירה" },
        { name: "city", placeholder: "עיר", required: true },
        { name: "zipcode", placeholder: "מיקוד" },
        { name: "lat", placeholder: "קו רוחב" },
        { name: "lng", placeholder: "קו אורך" },
        { name: "phone", placeholder: "טלפון", required: true },
        { name: "companyName", placeholder: "שם חברה" },
        { name: "companyCatchPhrase", placeholder: "סלוגן" },
        { name: "companyBs", placeholder: "תחום עיסוק" }
    ];
    
    return (
        <DynamicForm 
            fields={fields}
            onSubmit={onSubmit}
            submitButtonText="הירשם"
        />
    );
}
```

#### מגבלות ובעיות

1. **תומך רק ב-input**
   - לא תומך ב-textarea, select, checkbox מורכב
   - פתרון: הרחבה עם `fieldType`:
     ```javascript
     {
         name: "body",
         placeholder: "תוכן",
         fieldType: "textarea"  // במקום type
     }
     ```

2. **אין ולידציות מותאמות**
   - רק `required` של HTML
   - אין בדיקת פורמט (אימייל, טלפון, וכו')
   - פתרון: הוסף `validate` function:
     ```javascript
     {
         name: "email",
         validate: (value) => /\S+@\S+\.\S+/.test(value)
     }
     ```

3. **מאפס תמיד אחרי submit**
   - גם אם נכשל
   - פתרון: אפס רק אם onSubmit מחזיר success

4. **אין הצגת שגיאות**
   - אין feedback למשתמש
   - פתרון: הוסף error state:
     ```javascript
     const [errors, setErrors] = useState({});
     ```

5. **אין disabled state**
   - אפשר לשלוח כמה פעמים בזמן טעינה
   - פתרון:
     ```javascript
     const [isSubmitting, setIsSubmitting] = useState(false);
     ```

#### שיפורים מומלצים

```javascript
function DynamicForm({ fields, onSubmit, submitButtonText }) {
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
    );
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // נקה שגיאה של השדה
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const validate = () => {
        const newErrors = {};
        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = 'שדה חובה';
            }
            if (field.validate && !field.validate(formData[field.name])) {
                newErrors[field.name] = field.errorMessage || 'ערך לא תקין';
            }
        });
        return newErrors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            // אפס רק אם הצליח
            setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
        } catch (error) {
            setErrors({ submit: 'שגיאה בשליחה' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {fields.map((field) => (
                <div key={field.name}>
                    {field.fieldType === 'textarea' ? (
                        <textarea
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            required={!!field.required}
                        />
                    ) : (
                        <input
                            name={field.name}
                            type={field.type || "text"}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            required={!!field.required}
                        />
                    )}
                    {errors[field.name] && (
                        <span style={{ color: 'red' }}>{errors[field.name]}</span>
                    )}
                </div>
            ))}
            {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'שולח...' : (submitButtonText || "Submit")}
            </button>
        </form>
    );
}
```

---


## קומפוננטות רשימות (List Components)

### Posts.jsx

#### מטרה כללית (Macro)
מנהל את רשימת הפוסטים של משתמש עם אפשרות לסנן בין "הפוסטים שלי" ל"פוסטים של אחרים", חיפוש לפי קריטריונים, ועדכון/מחיקה של פוסטים.

#### Hooks ו-Dependencies

##### useParams()
```javascript
const { userId } = useParams();
```
- שולף את `userId` מה-URL
- דוגמה: `/home/users/5/posts` → `userId = "5"`
- **חשוב**: זה string, לא number!

##### localStorage
```javascript
const currentUser = JSON.parse(localStorage.getItem(userId) || '{}');
const currentUserEmail = currentUser.email;
```
- קורא את פרטי המשתמש המחובר
- אם אין נתונים, מחזיר אובייקט ריק `{}`
- שולף את ה-email לצורך בדיקת בעלות על פוסטים

##### useApi
```javascript
const { data: posts, getItems, deleteItem, updateItem } = useApi("posts");
```
- `data` → שם מחדש ל-`posts`
- `getItems` → לטעינת פוסטים
- `deleteItem` → למחיקת פוסט
- `updateItem` → לעדכון פוסט

#### State מקומי

##### searchBy (string)
```javascript
const [searchBy, setSearchBy] = useState('');
```
- **מטרה**: שדה החיפוש הנבחר
- **ערכים אפשריים**: `''`, `'id'`, `'title'`
- **ברירת מחדל**: מחרוזת ריקה (אין חיפוש)
- **מתי משתנה**: כשבוחרים אופציה ב-SearchFilter

##### searchValue (string)
```javascript
const [searchValue, setSearchValue] = useState('');
```
- **מטרה**: הערך שמחפשים
- **דוגמאות**: `"test"`, `"5"`, `"כותרת"`
- **ברירת מחדל**: מחרוזת ריקה
- **מתי משתנה**: כשמקלידים בשדה החיפוש

##### showMyPosts (boolean)
```javascript
const [showMyPosts, setShowMyPosts] = useState(true);
```
- **מטרה**: סינון פוסטים - שלי או של אחרים
- **ערכים**:
  - `true`: מציג רק פוסטים של המשתמש המחובר
  - `false`: מציג פוסטים של כל המשתמשים האחרים (לא שלי)
- **ברירת מחדל**: `true` (הפוסטים שלי)
- **מתי משתנה**: לחיצה על כפתורים "הפוסטים שלי" / "פוסטים של אחרים"

#### useEffect - לוגיקת טעינה

```javascript
useEffect(() => {
    const params = {};
    
    if (showMyPosts) {
        params.userId = userId;
    } else {
        params.userId_ne = userId;
    }

    if (searchBy && searchValue) {
        params[searchBy] = searchValue;
    }

    getItems(params);
}, [showMyPosts, searchBy, searchValue, getItems]);
```

**Dependencies**: `[showMyPosts, searchBy, searchValue, getItems]`
- נטען מחדש כל פעם שאחד מהם משתנה

**לוגיקת params**:

1. **סינון לפי בעלות**:
   ```javascript
   if (showMyPosts) {
       params.userId = userId;  // רק פוסטים שלי
   } else {
       params.userId_ne = userId;  // NOT EQUAL - כל הפוסטים חוץ משלי
   }
   ```
   - `userId_ne` זה תחביר של json-server
   - `_ne` = "not equal"

2. **חיפוש**:
   ```javascript
   if (searchBy && searchValue) {
       params[searchBy] = searchValue;
   }
   ```
   - רק אם שני השדות מלאים
   - `params[searchBy]` = dynamic key
   - דוגמה: אם `searchBy = "title"` ו-`searchValue = "test"`
     → `params.title = "test"`

**דוגמאות params**:
```javascript
// הפוסטים שלי, ללא חיפוש
{ userId: "5" }

// פוסטים של אחרים, ללא חיפוש
{ userId_ne: "5" }

// הפוסטים שלי, חיפוש לפי כותרת
{ userId: "5", title: "test" }

// פוסטים של אחרים, חיפוש לפי ID
{ userId_ne: "5", id: "10" }
```

#### searchOptions

```javascript
const searchOptions = [
    { value: 'id', label: 'חיפוש לפי ID' },
    { value: 'title', label: 'חיפוש לפי כותרת' }
];
```
- מערך של אפשרויות חיפוש
- מועבר ל-`SearchFilter` component
- `value` = שם השדה ב-API
- `label` = טקסט להצגה למשתמש

#### לוגיקת Render

##### כפתורי סינון
```javascript
<div>
    <button 
        onClick={() => setShowMyPosts(true)} 
        disabled={showMyPosts}
    >
        הפוסטים שלי
    </button>
    <button 
        onClick={() => setShowMyPosts(false)} 
        disabled={!showMyPosts}
    >
        פוסטים של אחרים
    </button>
</div>
```
- כפתור מושבת (disabled) אם הוא כבר פעיל
- `disabled={showMyPosts}` = מושבת אם `showMyPosts === true`
- `disabled={!showMyPosts}` = מושבת אם `showMyPosts === false`

##### SearchFilter
```javascript
<SearchFilter 
    searchOptions={searchOptions}
    searchBy={searchBy}
    setSearchBy={setSearchBy}
    searchValue={searchValue}
    setSearchValue={setSearchValue}
/>
```
- מעביר את כל ה-state ו-setters
- SearchFilter מנהל את ה-UI של החיפוש

##### רשימת פוסטים
```javascript
<div className="posts-list">
    {posts.map(post => (
        <PostItem 
            key={post.id} 
            post={post} 
            isPostOwner={post.userId === parseInt(userId)}
            deletePost={deleteItem} 
            updatePost={updateItem}
            currentUserEmail={currentUserEmail}
        />
    ))}
</div>
```

**Props שמועברים ל-PostItem**:
1. **post**: האובייקט המלא
2. **isPostOwner**: בדיקת בעלות
   - `post.userId` (number) === `parseInt(userId)` (המרה מ-string)
   - חשוב: `userId` מה-URL הוא string!
3. **deletePost**: הפונקציה `deleteItem` מ-useApi
4. **updatePost**: הפונקציה `updateItem` מ-useApi
5. **currentUserEmail**: לצורך תגובות

#### זרימת נתונים

```
[Component Mount]
    ↓
useEffect runs
    ↓
getItems({ userId: "5" })
    ↓
Server Response
    ↓
setData(posts) ב-useApi
    ↓
posts state מתעדכן
    ↓
Re-render עם הפוסטים
    ↓
[משתמש לוחץ "פוסטים של אחרים"]
    ↓
setShowMyPosts(false)
    ↓
useEffect runs again
    ↓
getItems({ userId_ne: "5" })
    ↓
...
```

#### תרחישי שימוש

##### תרחיש 1: טעינה ראשונית
```
1. Component נטען
2. showMyPosts = true (default)
3. searchBy = '', searchValue = ''
4. useEffect → getItems({ userId: "5" })
5. מציג את כל הפוסטים של משתמש 5
```

##### תרחיש 2: מעבר לפוסטים של אחרים
```
1. לחיצה על "פוסטים של אחרים"
2. setShowMyPosts(false)
3. useEffect → getItems({ userId_ne: "5" })
4. מציג פוסטים של כולם חוץ ממשתמש 5
```

##### תרחיש 3: חיפוש לפי כותרת
```
1. בוחר "חיפוש לפי כותרת" → setSearchBy('title')
2. מקליד "test" → setSearchValue('test')
3. useEffect → getItems({ userId: "5", title: "test" })
4. מציג רק פוסטים של משתמש 5 עם כותרת "test"
```

##### תרחיש 4: מחיקת פוסט
```
1. לחיצה על "מחק" ב-PostItem
2. PostItem קורא deletePost(postId)
3. deletePost = deleteItem מ-useApi
4. useApi שולח DELETE request
5. useApi מסנן את הפוסט מ-posts state
6. Re-render ללא הפוסט שנמחק
```

##### תרחיש 5: עדכון פוסט
```
1. עריכת כותרת ב-PostItem
2. PostItem קורא updatePost(postId, { title: "חדש" })
3. updatePost = updateItem מ-useApi
4. useApi שולח PATCH request
5. useApi מעדכן את הפוסט ב-posts state
6. Re-render עם הכותרת החדשה
```

#### בעיות ידועות

1. **userId הוא string**
   ```javascript
   // בעיה:
   post.userId === userId  // false! (5 !== "5")
   
   // פתרון:
   post.userId === parseInt(userId)  // true
   ```

2. **אין טיפול ב-loading state**
   - לא יודעים אם הנתונים נטענים
   - פתרון:
     ```javascript
     const [isLoading, setIsLoading] = useState(true);
     
     useEffect(() => {
         setIsLoading(true);
         getItems(params).finally(() => setIsLoading(false));
     }, [...]);
     
     if (isLoading) return <div>טוען...</div>;
     ```

3. **אין טיפול ברשימה ריקה**
   - אם אין פוסטים, מציג רשימה ריקה בלי הודעה
   - פתרון:
     ```javascript
     {posts.length === 0 && <p>אין פוסטים להצגה</p>}
     ```

4. **חיפוש לא מדויק**
   - json-server עושה exact match
   - "test" לא ימצא "testing"
   - פתרון: שימוש ב-`_like` במקום `=`:
     ```javascript
     params[`${searchBy}_like`] = searchValue;
     ```

5. **אין debouncing בחיפוש**
   - כל הקשה שולחת request
   - פתרון:
     ```javascript
     const [debouncedValue, setDebouncedValue] = useState(searchValue);
     
     useEffect(() => {
         const timer = setTimeout(() => {
             setDebouncedValue(searchValue);
         }, 500);
         return () => clearTimeout(timer);
     }, [searchValue]);
     
     // השתמש ב-debouncedValue ב-useEffect הראשי
     ```

---

### Todos.jsx

#### מטרה כללית (Macro)
מציג רשימת מטלות (todos) של משתמש עם אפשרויות מיון וחיפוש. פשוט יותר מ-Posts כי אין סינון "שלי/אחרים" (תמיד רק של המשתמש המחובר).

#### Hooks

```javascript
const { userId } = useParams();
const { data: todos, getItems, deleteItem, updateItem, addItem } = useApi("todos");
```

#### State מקומי

##### sortBy (string)
```javascript
const [sortBy, setSortBy] = useState('id');
```
- **מטרה**: שדה המיון
- **ערכים אפשריים**: `'id'`, `'title'`, `'completed'`
- **ברירת מחדל**: `'id'` (מיון לפי מזהה)
- **מתי משתנה**: בחירה ב-SortDropdown

##### searchBy, searchValue
```javascript
const [searchBy, setSearchBy] = useState('');
const [searchValue, setSearchValue] = useState('');
```
- זהה ל-Posts.jsx

#### useEffect - לוגיקת טעינה

```javascript
useEffect(() => {
    const params = {
        userId: userId,
        _sort: sortBy
    };
    if (searchBy && searchValue) {
        params[searchBy] = searchValue;
    }
    getItems(params);
}, [userId, sortBy, searchBy, searchValue, getItems]);
```

**הבדלים מ-Posts**:
1. **תמיד מסנן לפי userId** (אין אופציה "של אחרים")
2. **מוסיף _sort**: `_sort: sortBy`
   - זה תחביר של json-server למיון
   - דוגמה: `_sort=title` ימיין לפי כותרת

**דוגמאות params**:
```javascript
// מיון לפי ID, ללא חיפוש
{ userId: "5", _sort: "id" }

// מיון לפי כותרת, חיפוש לפי מצב
{ userId: "5", _sort: "title", completed: "true" }

// מיון לפי completed, חיפוש לפי ID
{ userId: "5", _sort: "completed", id: "3" }
```

#### Options

##### sortOptions
```javascript
const sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Title' },
    { value: 'completed', label: 'Status' }
];
```
- מועבר ל-SortDropdown
- קובע לפי איזה שדה למיין

##### searchOptions
```javascript
const searchOptions = [
    { value: 'id', label: 'חיפוש לפי ID' },
    { value: 'title', label: 'חיפוש לפי כותרת' },
    { value: 'completed', label: 'חיפוש לפי מצב ביצוע' }
];
```
- מועבר ל-SearchFilter
- כולל אפשרות לחפש לפי `completed`

#### לוגיקת Render

```javascript
return (
    <>
        <SortDropdown 
            sortOptions={sortOptions} 
            sortBy={sortBy} 
            setSortBy={setSortBy} 
        />
        
        <SearchFilter 
            searchOptions={searchOptions}
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
        />

        {todos.map(todo => (
            <TodoItem 
                key={todo.id} 
                todo={todo} 
                onDelete={deleteItem} 
                onUpdate={updateItem} 
            />
        ))}
    </>
);
```

**Props ל-TodoItem**:
- `todo`: האובייקט המלא
- `onDelete`: `deleteItem` מ-useApi
- `onUpdate`: `updateItem` מ-useApi
- **אין** `isOwner` - כל המטלות שייכות למשתמש המחובר

#### תרחישי שימוש

##### תרחיש 1: מיון לפי כותרת
```
1. בוחר "Title" ב-SortDropdown
2. setSortBy('title')
3. useEffect → getItems({ userId: "5", _sort: "title" })
4. json-server מחזיר מטלות ממוינות לפי כותרת
```

##### תרחיש 2: חיפוש מטלות שהושלמו
```
1. בוחר "חיפוש לפי מצב ביצוע"
2. מקליד "true"
3. useEffect → getItems({ userId: "5", _sort: "id", completed: "true" })
4. מציג רק מטלות שהושלמו
```

##### תרחיש 3: עדכון מצב completed
```
1. משתמש מסמן checkbox ב-TodoItem
2. TodoItem קורא onUpdate(todoId, { ...todo, completed: true })
3. useApi שולח PATCH request
4. useApi מעדכן את המטלה ב-todos state
5. Re-render עם המצב החדש
```

#### הערות חשובות

1. **completed הוא boolean ב-object, string בחיפוש**
   ```javascript
   // ב-todo object:
   { id: 1, title: "משימה", completed: true }
   
   // בחיפוש:
   params.completed = "true"  // string!
   ```

2. **json-server מיון**
   - `_sort=field` - מיון עולה (ascending)
   - `_sort=field&_order=desc` - מיון יורד (descending)
   - הקוד הנוכחי תומך רק במיון עולה

3. **אין הוספת מטלה**
   - `addItem` קיים ב-useApi אבל לא בשימוש
   - אפשר להוסיף כפתור "הוסף מטלה"

---

### AlbumsList.jsx

#### מטרה כללית (Macro)
מציג רשימת אלבומים של משתמש עם אפשרות חיפוש ויצירת אלבום חדש.

#### Hooks

```javascript
const { userId } = useParams();
const { data: albums, getItems, deleteItem, updateItem, addItem } = useApi("albums");
```

#### State מקומי

##### searchBy, searchValue
```javascript
const [searchBy, setSearchBy] = useState('');
const [searchValue, setSearchValue] = useState('');
```
- זהה לקומפוננטות אחרות

##### showCreateForm (boolean)
```javascript
const [showCreateForm, setShowCreateForm] = useState(false);
```
- **מטרה**: האם להציג טופס יצירת אלבום
- **ברירת מחדל**: `false` (מוסתר)
- **מתי משתנה**: לחיצה על כפתור "Create New Album" / "Cancel"

#### useEffect

```javascript
useEffect(() => {
    const params = { userId: userId };

    if (searchBy && searchValue) {
        params[searchBy] = searchValue;
    }
    getItems(params);
}, [userId, searchBy, searchValue, getItems]);
```

- פשוט יותר מ-Posts ו-Todos
- אין מיון, אין סינון "שלי/אחרים"
- תמיד מסנן לפי `userId`

#### פונקציות פנימיות

##### handleCreateAlbum(formData)
```javascript
const handleCreateAlbum = async (formData) => {
    await addItem({
        title: formData.title,
        userId: parseInt(userId)
    });
    setShowCreateForm(false);
};
```

**תהליך**:
1. מקבל `formData` מ-DynamicForm
2. קורא `addItem` עם:
   - `title` מהטופס
   - `userId` מה-URL (מומר ל-number)
3. מחכה לתגובה (`await`)
4. סוגר את הטופס

**הערות**:
- `await` מבטיח שהאלבום נוצר לפני סגירת הטופס
- אם נכשל, הטופס נשאר פתוח (אין try-catch)
- האלבום החדש מתווסף אוטומטית ל-albums state (ב-useApi)

#### Options ו-Fields

##### searchOptions
```javascript
const searchOptions = [
    { value: 'id', label: 'חיפוש לפי ID' },
    { value: 'title', label: 'חיפוש לפי כותרת' }
];
```

##### createFields
```javascript
const createFields = [
    { name: 'title', placeholder: 'Album Title', type: 'text' }
];
```
- רק שדה אחד - כותרת
- מועבר ל-DynamicForm

#### לוגיקת Render

##### כפתור יצירה
```javascript
<button onClick={() => setShowCreateForm(!showCreateForm)}>
    {showCreateForm ? 'Cancel' : 'Create New Album'}
</button>
```
- טקסט דינמי: "Create" או "Cancel"
- toggle של `showCreateForm`

##### טופס יצירה
```javascript
{showCreateForm && (
    <DynamicForm 
        fields={createFields}
        onSubmit={handleCreateAlbum}
        submitButtonText="Create Album"
    />
)}
```
- מוצג רק אם `showCreateForm === true`
- conditional rendering עם `&&`

##### רשימת אלבומים
```javascript
<div className="albums-list">
    {albums.map(album => (
        <AlbumItem 
            key={album.id} 
            album={album} 
            deleteItem={deleteItem} 
            updateItem={updateItem}
            isOwner={album.userId === parseInt(userId)}
        />
    ))}
</div>
```

**Props ל-AlbumItem**:
- `album`: האובייקט המלא
- `deleteItem`, `updateItem`: מ-useApi
- `isOwner`: בדיקת בעלות
  - `album.userId` (number) === `parseInt(userId)` (string → number)
  - קובע אם להציג כפתורי עריכה/מחיקה

#### תרחישי שימוש

##### תרחיש 1: יצירת אלבום חדש
```
1. לחיצה על "Create New Album"
2. setShowCreateForm(true)
3. טופס מופיע
4. משתמש מקליד "אלבום חדש"
5. לחיצה על "Create Album"
6. handleCreateAlbum נקרא
7. addItem({ title: "אלבום חדש", userId: 5 })
8. שרת מחזיר אלבום עם id
9. useApi מוסיף ל-albums state
10. setShowCreateForm(false)
11. טופס נעלם, אלבום מופיע ברשימה
```

##### תרחיש 2: ביטול יצירה
```
1. לחיצה על "Create New Album"
2. טופס מופיע
3. לחיצה על "Cancel"
4. setShowCreateForm(false)
5. טופס נעלם
```

##### תרחיש 3: מעבר לתמונות
```
1. לחיצה על כותרת אלבום ב-AlbumItem
2. AlbumItem מכיל Link ל-`/home/users/${userId}/albums/${albumId}`
3. ניווט ל-PhotosList
```

#### בעיות ידועות

1. **אין ולידציה על כותרת ריקה**
   - אפשר ליצור אלבום בלי כותרת
   - פתרון: הוסף `required: true` ב-createFields

2. **אין feedback על הצלחה**
   - לא יודעים שהאלבום נוצר
   - פתרון:
     ```javascript
     await addItem(...);
     alert('אלבום נוצר בהצלחה!');
     setShowCreateForm(false);
     ```

3. **אין טיפול בשגיאה**
   - אם `addItem` נכשל, הטופס נשאר פתוח בלי הודעה
   - פתרון:
     ```javascript
     try {
         await addItem(...);
         setShowCreateForm(false);
     } catch (error) {
         alert('שגיאה ביצירת אלבום');
     }
     ```

---


### PhotosList.jsx

#### מטרה כללית (Macro)
מציג תמונות של אלבום ספציפי עם pagination (עימוד) פשוט ואפשרות להוספת תמונה חדשה. זוהי הקומפוננטה היחידה עם pagination מובנה.

#### Hooks

```javascript
const { userId, albumId } = useParams();
```
- שני פרמטרים מה-URL
- דוגמה: `/home/users/5/albums/3` → `userId="5"`, `albumId="3"`

```javascript
const { data: photos, getItems, deleteItem, updateItem, addItem } = useApi("photos");
const { data: albums, getItems: getAlbums } = useApi("albums");
```
- **שני useApi calls!**
- `photos` - לתמונות
- `albums` - לפרטי האלבום (כותרת)
- `getAlbums` - שם מחדש כדי לא להתנגש עם `getItems`

#### State מקומי

##### currentPage (number)
```javascript
const [currentPage, setCurrentPage] = useState(0);
```
- **מטרה**: עמוד נוכחי (מתחיל מ-0)
- **ברירת מחדל**: 0 (עמוד ראשון)
- **מתי משתנה**: לחיצה על כפתורי "הקודם"/"הבא"

##### photosPerPage (number)
```javascript
const [photosPerPage] = useState(6);
```
- **מטרה**: כמה תמונות להציג בעמוד
- **קבוע**: 6 (לא משתנה)
- **למה useState?**: אפשר לשנות בעתיד (למשל, dropdown לבחירת כמות)

##### showAddForm (boolean)
```javascript
const [showAddForm, setShowAddForm] = useState(false);
```
- זהה ל-AlbumsList

#### Computed Values (ערכים מחושבים)

##### currentAlbum
```javascript
const currentAlbum = albums.find(album => album.id === albumId);
```
- **מטרה**: מציאת האלבום הנוכחי מתוך `albums`
- **בעיה**: `albumId` הוא string, `album.id` הוא number
  - צריך: `album.id === parseInt(albumId)`
  - הקוד הנוכחי לא יעבוד!
- **שימוש**: הצגת כותרת האלבום

##### startIndex, endIndex
```javascript
const startIndex = currentPage * photosPerPage;
const endIndex = startIndex + photosPerPage;
```
- **מטרה**: חישוב גבולות העמוד הנוכחי
- **דוגמאות**:
  ```javascript
  // עמוד 0, 6 תמונות לעמוד
  startIndex = 0 * 6 = 0
  endIndex = 0 + 6 = 6
  // תמונות 0-5
  
  // עמוד 1
  startIndex = 1 * 6 = 6
  endIndex = 6 + 6 = 12
  // תמונות 6-11
  
  // עמוד 2
  startIndex = 2 * 6 = 12
  endIndex = 12 + 6 = 18
  // תמונות 12-17
  ```

##### currentPhotos
```javascript
const currentPhotos = photos.slice(startIndex, endIndex);
```
- **מטרה**: חיתוך המערך לתמונות של העמוד הנוכחי
- `slice(start, end)` - מחזיר תת-מערך
- **דוגמה**:
  ```javascript
  photos = [1,2,3,4,5,6,7,8,9,10,11,12]
  currentPage = 1
  startIndex = 6, endIndex = 12
  currentPhotos = [7,8,9,10,11,12]
  ```

##### totalPages
```javascript
const totalPages = Math.ceil(photos.length / photosPerPage);
```
- **מטרה**: חישוב סך כל העמודים
- `Math.ceil` - עיגול למעלה
- **דוגמאות**:
  ```javascript
  // 18 תמונות, 6 לעמוד
  Math.ceil(18 / 6) = Math.ceil(3) = 3 עמודים
  
  // 20 תמונות, 6 לעמוד
  Math.ceil(20 / 6) = Math.ceil(3.33) = 4 עמודים
  
  // 5 תמונות, 6 לעמוד
  Math.ceil(5 / 6) = Math.ceil(0.83) = 1 עמוד
  ```

#### useEffect

```javascript
useEffect(() => {
    getItems({ albumId: albumId });
    getAlbums({ id: albumId });
}, [albumId, getItems, getAlbums]);
```

**שתי קריאות**:
1. `getItems({ albumId: albumId })` - טוען תמונות של האלבום
2. `getAlbums({ id: albumId })` - טוען פרטי האלבום

**למה שתי קריאות?**
- photos API: `/photos?albumId=3`
- albums API: `/albums?id=3`
- צריך את שניהם לתצוגה מלאה

**בעיה**: `albumId` הוא string, צריך `parseInt`

#### פונקציות פנימיות

##### handleAddPhoto(formData)
```javascript
const handleAddPhoto = async (formData) => {
    await addItem({
        ...formData,
        albumId: parseInt(albumId)
    });
    setShowAddForm(false);
};
```

**תהליך**:
1. מקבל `formData` מ-DynamicForm
   - `{ title: "...", url: "..." }`
2. מוסיף `albumId` (מומר ל-number)
3. קורא `addItem` עם האובייקט המלא
4. סוגר את הטופס

**spread operator**:
```javascript
{
    ...formData,        // title, url
    albumId: parseInt(albumId)  // מוסיף albumId
}
// תוצאה:
{
    title: "...",
    url: "...",
    albumId: 3
}
```

#### לוגיקת Render

##### קישור חזרה
```javascript
<Link to={`/home/users/${userId}/albums`}>← Back to Albums</Link>
```
- ניווט חזרה לרשימת האלבומים
- משתמש ב-`userId` מה-URL

##### כותרת אלבום
```javascript
<h2>Album: {currentAlbum?.title || 'Loading...'}</h2>
```
- **optional chaining**: `currentAlbum?.title`
  - אם `currentAlbum` הוא `undefined`, לא יזרוק שגיאה
  - יחזיר `undefined`
- **nullish coalescing**: `|| 'Loading...'`
  - אם `currentAlbum?.title` הוא falsy, יציג "Loading..."

##### כפתור הוספה וטופס
```javascript
<button onClick={() => setShowAddForm(!showAddForm)}>
    {showAddForm ? 'Cancel' : 'Add Photo'}
</button>

{showAddForm && (
    <DynamicForm 
        fields={[
            { name: 'title', placeholder: 'Photo Title', type: 'text' },
            { name: 'url', placeholder: 'Photo URL', type: 'url' }
        ]}
        onSubmit={handleAddPhoto}
        submitButtonText="Add Photo"
    />
)}
```
- שני שדות: כותרת ו-URL
- `type: 'url'` - ולידציה בסיסית של HTML5

##### רשימת תמונות
```javascript
<div>
    {currentPhotos.map(photo => (
        <PhotoItem
            key={photo.id}
            photo={photo}
            deleteItem={deleteItem}
            updateItem={updateItem}
        />
    ))}
</div>
```
- מציג רק את `currentPhotos` (לא את כל `photos`)
- pagination מתבצע כאן!

##### הודעה אם אין תמונות
```javascript
{photos.length === 0 && <p>No photos in this album</p>}
```
- מוצג רק אם `photos` ריק לגמרי
- לא מוצג אם יש תמונות אבל בעמוד אחר

##### כפתורי pagination
```javascript
{totalPages > 1 && (
    <div>
        <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
        >
            הקודם
        </button>

        <span>
            עמוד {currentPage + 1} מתוך {totalPages}
        </span>

        <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
        >
            הבא
        </button>
    </div>
)}
```

**פירוט**:

1. **תנאי הצגה**: `totalPages > 1`
   - pagination מוצג רק אם יש יותר מעמוד אחד

2. **כפתור "הקודם"**:
   ```javascript
   onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
   ```
   - `prev - 1` - מוריד 1 מהעמוד הנוכחי
   - `Math.max(0, ...)` - מבטיח שלא נרד מתחת ל-0
   - דוגמה: אם `prev = 0`, `Math.max(0, -1) = 0`
   
   ```javascript
   disabled={currentPage === 0}
   ```
   - מושבת בעמוד הראשון

3. **תצוגת עמוד**:
   ```javascript
   עמוד {currentPage + 1} מתוך {totalPages}
   ```
   - `currentPage + 1` כי currentPage מתחיל מ-0
   - דוגמה: עמוד 0 → "עמוד 1 מתוך 3"

4. **כפתור "הבא"**:
   ```javascript
   onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
   ```
   - `prev + 1` - מוסיף 1
   - `Math.min(totalPages - 1, ...)` - מבטיח שלא נעבור את העמוד האחרון
   - דוגמה: אם `totalPages = 3` ו-`prev = 2`, `Math.min(2, 3) = 2`
   
   ```javascript
   disabled={currentPage === totalPages - 1}
   ```
   - מושבת בעמוד האחרון
   - `totalPages - 1` כי currentPage מתחיל מ-0

#### תרחישי שימוש

##### תרחיש 1: טעינה ראשונית
```
1. Component נטען עם albumId=3
2. useEffect → getItems({ albumId: "3" })
3. useEffect → getAlbums({ id: "3" })
4. photos = [1,2,3,4,5,6,7,8,9,10,11,12]
5. currentPage = 0
6. currentPhotos = photos.slice(0, 6) = [1,2,3,4,5,6]
7. totalPages = Math.ceil(12/6) = 2
8. מציג תמונות 1-6 עם pagination
```

##### תרחיש 2: מעבר לעמוד הבא
```
1. לחיצה על "הבא"
2. setCurrentPage(prev => Math.min(1, 0+1)) = 1
3. currentPhotos = photos.slice(6, 12) = [7,8,9,10,11,12]
4. Re-render עם תמונות 7-12
5. כפתור "הקודם" כבר לא מושבת
6. כפתור "הבא" מושבת (עמוד אחרון)
```

##### תרחיש 3: הוספת תמונה
```
1. לחיצה על "Add Photo"
2. מילוי טופס: title="חדש", url="http://..."
3. handleAddPhoto נקרא
4. addItem({ title: "חדש", url: "http://...", albumId: 3 })
5. useApi מוסיף ל-photos state
6. photos.length = 13
7. totalPages = Math.ceil(13/6) = 3
8. אם currentPage=2, התמונה החדשה תופיע בעמוד 3
```

#### בעיות ידועות

1. **albumId comparison bug**
   ```javascript
   // לא עובד:
   const currentAlbum = albums.find(album => album.id === albumId);
   
   // צריך:
   const currentAlbum = albums.find(album => album.id === parseInt(albumId));
   ```

2. **pagination לא מתאפס בשינוי אלבום**
   ```javascript
   // אם עוברים מאלבום לאלבום, currentPage נשאר
   // פתרון:
   useEffect(() => {
       setCurrentPage(0);
   }, [albumId]);
   ```

3. **אין loading state**
   - בזמן טעינה, `currentAlbum` הוא undefined
   - מציג "Loading..." אבל לא spinner

4. **שתי קריאות API נפרדות**
   - לא יעיל - אפשר לקבל את כותרת האלבום מהעמוד הקודם
   - פתרון: העבר `album` דרך `location.state`

5. **אין טיפול בעמוד לא קיים**
   - אם `currentPage = 5` אבל יש רק 3 עמודים
   - `currentPhotos` יהיה ריק
   - פתרון:
     ```javascript
     useEffect(() => {
         if (currentPage >= totalPages && totalPages > 0) {
             setCurrentPage(totalPages - 1);
         }
     }, [totalPages, currentPage]);
     ```

---

### CommentsList.jsx

#### מטרה כללית (Macro)
טוען ומציג תגובות לפוסט ספציפי, מאפשר הוספת תגובה חדשה, עריכה ומחיקה של תגובות קיימות (אם המשתמש הוא הבעלים).

#### Props

##### postId (number/string, required)
```javascript
function CommentsList({ postId, currentUserEmail = "user@example.com" })
```
- **מטרה**: מזהה הפוסט שאליו שייכות התגובות
- **סוג**: יכול להיות number או string (תלוי איך מועבר)
- **שימוש**: בקריאה ל-`getItems({ postId: parseInt(postId) })`

##### currentUserEmail (string, optional)
- **מטרה**: מייל המשתמש הנוכחי לבדיקת בעלות על תגובות
- **ברירת מחדל**: `"user@example.com"`
- **שימוש**: מועבר ל-CommentItem לבדיקת `comment.email === currentUserEmail`

#### Hooks

```javascript
const { data: comments, getItems, deleteItem, updateItem, addItem } = useApi("comments");
```

#### State מקומי

##### showAddForm (boolean)
```javascript
const [showAddForm, setShowAddForm] = useState(false);
```
- האם להציג טופס הוספת תגובה
- ברירת מחדל: `false`

#### useEffect

```javascript
useEffect(() => {
    console.log('Fetching comments for postId:', postId);
    getItems({ postId: parseInt(postId) });
}, [postId, getItems]);
```

**תהליך**:
1. רץ כש-`postId` או `getItems` משתנים
2. מדפיס log (debug)
3. קורא `getItems` עם `postId` מומר ל-number

**למה parseInt?**
- `postId` יכול להגיע כ-string מ-URL params
- API מצפה ל-number
- `parseInt("5")` → `5`

**console.log**:
- שימושי ל-debugging
- כדאי להסיר בפרודקשן

#### פונקציות פנימיות

##### handleAddComment(formData)
```javascript
const handleAddComment = (formData) => {
    addItem({
        name: "My Comment",
        email: currentUserEmail,
        postId: parseInt(postId),
        body: formData.body
    });
    setShowAddForm(false);
};
```

**תהליך**:
1. מקבל `formData` מ-DynamicForm
   - `{ body: "תוכן התגובה..." }`
2. יוצר אובייקט תגובה מלא:
   - `name`: **קבוע** - "My Comment" (לא מותאם אישית!)
   - `email`: מה-prop
   - `postId`: מה-prop (מומר ל-number)
   - `body`: מהטופס
3. קורא `addItem`
4. סוגר את הטופס

**בעיה**: `name` תמיד "My Comment"
- לא משתמש בשם האמיתי של המשתמש
- פתרון: שלוף מ-localStorage או הוסף שדה בטופס

#### לוגיקת Render

##### כותרת וכפתור
```javascript
<h4>תגובות:</h4>
<button onClick={() => setShowAddForm(!showAddForm)}>
    הוסף תגובה חדשה
</button>
```
- כפתור toggle של הטופס

##### טופס הוספה
```javascript
{showAddForm && (
    <DynamicForm 
        fields={[{ name: 'body', placeholder: 'תוכן התגובה...', type: 'text' }]}
        onSubmit={handleAddComment}
        submitButtonText="שלח תגובה"
    />
)}
```
- שדה אחד בלבד: `body`
- `type: 'text'` - אבל צריך להיות `textarea` לתגובה ארוכה!

##### רשימת תגובות
```javascript
{comments && comments.length > 0 ? (
    comments.map(comment => (
        <CommentItem 
            key={comment.id} 
            comment={comment} 
            onDelete={deleteItem}
            onUpdate={updateItem}
            currentUserEmail={currentUserEmail}
        />
    ))
) : (
    <p>אין תגובות לפוסט זה</p>
)}
```

**תנאי**:
- `comments && comments.length > 0` - בדיקה כפולה
  - `comments` - קיים (לא null/undefined)
  - `comments.length > 0` - לא ריק

**Props ל-CommentItem**:
- `comment`: האובייקט המלא
- `onDelete`: `deleteItem` מ-useApi
- `onUpdate`: `updateItem` מ-useApi
- `currentUserEmail`: לבדיקת בעלות

#### תרחישי שימוש

##### תרחיש 1: טעינת תגובות
```
1. Component נטען עם postId=5
2. useEffect → getItems({ postId: 5 })
3. Server מחזיר תגובות
4. comments = [
     { id: 1, name: "...", email: "a@a.com", body: "...", postId: 5 },
     { id: 2, name: "...", email: "b@b.com", body: "...", postId: 5 }
   ]
5. מציג 2 CommentItem components
```

##### תרחיש 2: הוספת תגובה
```
1. לחיצה על "הוסף תגובה חדשה"
2. setShowAddForm(true)
3. טופס מופיע
4. משתמש מקליד "תגובה חדשה"
5. לחיצה על "שלח תגובה"
6. handleAddComment נקרא
7. addItem({
     name: "My Comment",
     email: "user@test.com",
     postId: 5,
     body: "תגובה חדשה"
   })
8. Server מחזיר תגובה עם id
9. useApi מוסיף ל-comments state
10. setShowAddForm(false)
11. טופס נעלם, תגובה חדשה מופיעה
```

##### תרחיש 3: מחיקת תגובה
```
1. משתמש לוחץ "מחק" ב-CommentItem
2. CommentItem קורא onDelete(commentId)
3. onDelete = deleteItem מ-useApi
4. useApi שולח DELETE request
5. useApi מסנן את התגובה מ-comments state
6. Re-render ללא התגובה
```

##### תרחיש 4: עריכת תגובה
```
1. משתמש לוחץ "ערוך" ב-CommentItem
2. CommentItem משתמש ב-GenericItem
3. GenericItem עובר למצב עריכה
4. משתמש משנה את התוכן
5. לחיצה על "שמור"
6. GenericItem קורא onUpdate(id, { body: "..." })
7. onUpdate = updateItem מ-useApi
8. useApi שולח PATCH request
9. useApi מעדכן את התגובה ב-comments state
10. GenericItem חוזר למצב תצוגה
```

#### בעיות ידועות

1. **name קבוע**
   ```javascript
   // בעיה:
   name: "My Comment"
   
   // פתרון:
   const currentUser = JSON.parse(localStorage.getItem(userId));
   name: currentUser.name || "Anonymous"
   ```

2. **type: 'text' במקום textarea**
   - שדה קצר לתגובה
   - פתרון: הרחב את DynamicForm לתמוך ב-textarea

3. **אין ולידציה על תוכן ריק**
   - אפשר לשלוח תגובה ריקה
   - פתרון: הוסף `required: true` ב-fields

4. **console.log בפרודקשן**
   - מדפיס בכל טעינה
   - פתרון: הסר או השתמש ב-development mode בלבד

5. **אין מיון תגובות**
   - מוצגות בסדר שהשרת מחזיר
   - פתרון: הוסף `_sort=id&_order=desc` ל-getItems

---

