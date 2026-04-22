package workout_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import workout_tracker.model.Exercise;
import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByMuscleGroup(String muscleGroup);
}
