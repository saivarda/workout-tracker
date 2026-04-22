package workout_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import workout_tracker.model.WorkoutSet;
import java.util.List;

public interface WorkoutSetRepository extends JpaRepository<WorkoutSet, Long> {
    List<WorkoutSet> findByExerciseIdOrderByWorkoutSession_DateDesc(Long exerciseId);
    List<WorkoutSet> findByWorkoutSessionId(Long sessionId);
}
