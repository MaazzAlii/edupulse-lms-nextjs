const dns = require('dns');
// Set DNS servers to avoid querySrv ECONNREFUSED on some Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Failed to set custom DNS servers, using defaults:', e.message);
}

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 1. Parse MONGO_URI from .env.local
let mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split(/\r?\n/);
      for (const line of lines) {
        if (line.startsWith('MONGO_URI=')) {
          mongoUri = line.substring('MONGO_URI='.length).trim();
          // Remove potential wrapping quotes
          if (mongoUri.startsWith('"') && mongoUri.endsWith('"')) {
            mongoUri = mongoUri.slice(1, -1);
          } else if (mongoUri.startsWith("'") && mongoUri.endsWith("'")) {
            mongoUri = mongoUri.slice(1, -1);
          }
          break;
        }
      }
    }
  } catch (e) {
    console.warn('Could not read .env.local file:', e.message);
  }
}

if (!mongoUri) {
  console.error('ERROR: MONGO_URI is not defined. Please define it in your environment or in a .env.local file.');
  process.exit(1);
}

// 2. Define Mongoose Schemas directly to bypass Next.js import layers
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
});
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  instructor: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  price: { type: Number, default: 0 },
  thumbnailUrl: { type: String, default: '' },
  isPublished: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const LessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  order: { type: Number, required: true },
  videoUrl: { type: String, default: '' },
  durationSeconds: { type: Number, default: 0 },
  isPreview: { type: Boolean, default: false }
}, { timestamps: true });
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

// Helper to slugify course titles
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    // 3. Create or find Categories
    console.log('\n--- Seeding Categories ---');
    const categoriesData = [
      { name: 'Web Development', slug: 'web-development' },
      { name: 'Python Programming', slug: 'python-programming' },
      { name: 'Advanced Engineering', slug: 'advanced-engineering' }
    ];

    const categoriesMap = {};
    for (const cat of categoriesData) {
      let existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        existing = await Category.create(cat);
        console.log(`Created Category: "${cat.name}"`);
      } else {
        console.log(`Found Existing Category: "${cat.name}"`);
      }
      categoriesMap[cat.slug] = existing._id;
    }

    // 4. Seeding Courses Data
    console.log('\n--- Seeding Courses & Lessons ---');
    const coursesData = [
      {
        title: 'React Web Development for Beginners',
        description: 'Learn React from the ground up. Master JSX, component architectures, props, state, event handling, hooks, custom hooks, context, and basic React routing in this hands-on project-centric course.',
        categorySlug: 'web-development',
        instructor: 'John Doe',
        level: 'Beginner',
        price: 0, // Free Course
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000',
        lessons: [
          {
            title: 'Introduction to React & JSX',
            order: 1,
            videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
            isPreview: true
          },
          {
            title: 'React Components, Props & State',
            order: 2,
            videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            isPreview: true
          },
          {
            title: 'React Hooks (useState & useEffect)',
            order: 3,
            videoUrl: 'https://www.youtube.com/watch?v=O6P86uwfdIM',
            isPreview: false
          }
        ]
      },
      {
        title: 'Complete Python Programming BootCamp',
        description: 'Take your coding skills to the next level with Python. We cover basic syntax, conditionals, functions, loops, lists, dictionaries, OOP paradigms, file operations, error handling, and basic web scraping.',
        categorySlug: 'python-programming',
        instructor: 'Jane Smith',
        level: 'Beginner',
        price: 19.99,
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000',
        lessons: [
          {
            title: 'Python Installation, Setup & Variables',
            order: 1,
            videoUrl: 'https://www.youtube.com/watch?v=Y8Tko2YC5hA',
            isPreview: true
          },
          {
            title: 'Control Flow, Conditions & Functions',
            order: 2,
            videoUrl: 'https://www.youtube.com/watch?v=8DvywoWv6fI',
            isPreview: false
          },
          {
            title: 'Classes and OOP Concepts in Python',
            order: 3,
            videoUrl: 'https://www.youtube.com/watch?v=JeznW_7DlB0',
            isPreview: false
          }
        ]
      },
      {
        title: 'Next.js 15 App Router Masterclass',
        description: 'Build robust, production-grade applications using Next.js 15. Leverage server and client component paradigms, layout management, dynamic route hooks, Server Actions, data fetching optimization, and MongoDB integration.',
        categorySlug: 'advanced-engineering',
        instructor: 'Alex Carter',
        level: 'Advanced',
        price: 49.99,
        thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000',
        lessons: [
          {
            title: 'Intro to Next.js 15 & Folder Structures',
            order: 1,
            videoUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
            isPreview: true
          },
          {
            title: 'Server vs Client Side Components',
            order: 2,
            videoUrl: 'https://www.youtube.com/watch?v=TJQSG22tqfQ',
            isPreview: true
          },
          {
            title: 'Server Actions, Database Mutators & Forms',
            order: 3,
            videoUrl: 'https://www.youtube.com/watch?v=dDpZfOQ87lo',
            isPreview: false
          }
        ]
      }
    ];

    for (const courseData of coursesData) {
      const baseSlug = slugify(courseData.title);
      let courseSlug = baseSlug;
      let counter = 1;

      // Ensure slug uniqueness
      while (await Course.exists({ slug: courseSlug })) {
        counter++;
        courseSlug = `${baseSlug}-${counter}`;
      }

      // Check if course already exists (by title matches)
      let existingCourse = await Course.findOne({ title: courseData.title });
      if (!existingCourse) {
        existingCourse = await Course.create({
          title: courseData.title,
          slug: courseSlug,
          description: courseData.description,
          category: categoriesMap[courseData.categorySlug],
          instructor: courseData.instructor,
          level: courseData.level,
          price: courseData.price,
          thumbnailUrl: courseData.thumbnailUrl,
          isPublished: true, // Marked published so guests can see immediately!
          averageRating: 4.8,
          numReviews: 1
        });
        console.log(`Created Published Course: "${courseData.title}"`);
      } else {
        // Ensure it is published
        existingCourse.isPublished = true;
        await existingCourse.save();
        console.log(`Found Existing Course (Ensured Published): "${courseData.title}"`);
      }

      // Seed/reseed lessons for this course
      for (const lessonData of courseData.lessons) {
        let existingLesson = await Lesson.findOne({
          course: existingCourse._id,
          order: lessonData.order
        });

        if (!existingLesson) {
          await Lesson.create({
            course: existingCourse._id,
            title: lessonData.title,
            order: lessonData.order,
            videoUrl: lessonData.videoUrl,
            durationSeconds: 180, // Default 3 minutes
            isPreview: lessonData.isPreview
          });
          console.log(`  -> Added Lesson ${lessonData.order}: "${lessonData.title}"`);
        } else {
          // Update URL in case it changed
          existingLesson.videoUrl = lessonData.videoUrl;
          existingLesson.isPreview = lessonData.isPreview;
          await existingLesson.save();
          console.log(`  -> Checked Lesson ${lessonData.order}: "${lessonData.title}"`);
        }
      }
    }

    console.log('\nDatabase seeding completed successfully! 🎉');
  } catch (error) {
    console.error('ERROR seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

seed();
