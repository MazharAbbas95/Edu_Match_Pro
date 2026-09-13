CREATE DATABASE IF NOT EXISTS edu_match_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edu_match_pro;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  password_reset_token CHAR(64) NULL,
  password_reset_expires DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessments (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  logic_score DECIMAL(10,2) NOT NULL DEFAULT 0,
  verbal_score DECIMAL(10,2) NOT NULL DEFAULT 0,
  discipline_score DECIMAL(10,2) NOT NULL DEFAULT 0,
  creativity_score DECIMAL(10,2) NOT NULL DEFAULT 0,
  top_trait VARCHAR(80) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_assessments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assessments_user_created (user_id, created_at)
);

CREATE TABLE IF NOT EXISTS assessment_suggestions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_id CHAR(36) NOT NULL,
  title VARCHAR(160) NOT NULL,
  industry VARCHAR(120) NOT NULL,
  CONSTRAINT fk_suggestions_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessment_traits (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_id CHAR(36) NOT NULL,
  trait_type ENUM('strength', 'weakness') NOT NULL,
  trait VARCHAR(160) NOT NULL,
  CONSTRAINT fk_traits_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interview_sessions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  type ENUM('University', 'Job', 'ISSB') NOT NULL,
  status ENUM('active', 'completed') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_interviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_interviews_user_created (user_id, created_at)
);

CREATE TABLE IF NOT EXISTS interview_transcript (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id CHAR(36) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  feedback_score DECIMAL(10,2) NULL,
  feedback_strengths TEXT NULL,
  feedback_improvements TEXT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transcript_session FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_questions (
  id CHAR(36) PRIMARY KEY,
  subject ENUM('math', 'logic', 'english') NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
  text VARCHAR(700) NOT NULL UNIQUE,
  correct_index INT NOT NULL,
  explanation TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_question_options (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question_id CHAR(36) NOT NULL,
  option_index INT NOT NULL,
  option_text TEXT NOT NULL,
  CONSTRAINT fk_options_question FOREIGN KEY (question_id) REFERENCES test_questions(id) ON DELETE CASCADE,
  UNIQUE KEY uq_question_option_index (question_id, option_index)
);

CREATE TABLE IF NOT EXISTS test_sessions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  current_difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
  questions_answered INT NOT NULL DEFAULT 0,
  correct_answers INT NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_test_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_test_sessions_user (user_id, is_completed)
);

CREATE TABLE IF NOT EXISTS test_session_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id CHAR(36) NOT NULL,
  question_id CHAR(36) NOT NULL,
  user_answer INT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
  CONSTRAINT fk_history_session FOREIGN KEY (session_id) REFERENCES test_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_history_question FOREIGN KEY (question_id) REFERENCES test_questions(id)
);