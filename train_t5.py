import argparse
import logging
from datasets import load_dataset
from transformers import (
    T5Tokenizer,
    T5ForConditionalGeneration,
    DataCollatorForSeq2Seq,
    Seq2SeqTrainingArguments,
    Seq2SeqTrainer,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--train_file", type=str, required=True)
    parser.add_argument("--validation_file", type=str, required=True)
    parser.add_argument("--test_file", type=str, required=True)
    parser.add_argument("--model_name_or_path", type=str, default="t5-small")
    parser.add_argument("--output_dir", type=str, default="./outputs")
    parser.add_argument("--num_train_epochs", type=int, default=3)
    parser.add_argument("--per_device_train_batch_size", type=int, default=4)
    parser.add_argument("--per_device_eval_batch_size", type=int, default=4)
    parser.add_argument("--max_train_samples", type=int, default=20000)
    parser.add_argument("--max_val_samples", type=int, default=2000)
    args = parser.parse_args()

    logger.info("Loading JSONL files...")
    dataset = load_dataset(
        "json",
        data_files={
            "train": args.train_file,
            "validation": args.validation_file,
            "test": args.test_file,
        },
        split=None,
    )
    logger.info(f"Dataset loaded: {dataset}")

    # Take subsets if requested
    if args.max_train_samples:
        dataset["train"] = dataset["train"].select(range(args.max_train_samples))
    if args.max_val_samples:
        dataset["validation"] = dataset["validation"].select(range(args.max_val_samples))

    logger.info("Loading tokenizer and model...")
    tokenizer = T5Tokenizer.from_pretrained(args.model_name_or_path)
    model = T5ForConditionalGeneration.from_pretrained(args.model_name_or_path)

    # Preprocess function
    def preprocess_function(batch):
        inputs = batch["text"]
        targets = batch["summary"]
        model_inputs = tokenizer(inputs, max_length=512, truncation=True)
        labels = tokenizer(targets, max_length=128, truncation=True)
        model_inputs["labels"] = labels["input_ids"]
        return model_inputs

    logger.info("Tokenizing dataset (this may take a while)...")
    tokenized_dataset = dataset.map(preprocess_function, batched=True, remove_columns=dataset["train"].column_names)

    data_collator = DataCollatorForSeq2Seq(tokenizer, model=model)

    logger.info("Setting up training arguments...")
    training_args = Seq2SeqTrainingArguments(
        output_dir=args.output_dir,
        evaluation_strategy="epoch",       # evaluate every epoch
        save_strategy="epoch",             # save every epoch
        load_best_model_at_end=True,       # now valid
        metric_for_best_model="loss",      # you can also use rouge1 if you add a metric function
        greater_is_better=False,           # because lower loss is better
        num_train_epochs=args.num_train_epochs,
        per_device_train_batch_size=args.per_device_train_batch_size,
        per_device_eval_batch_size=args.per_device_eval_batch_size,
        predict_with_generate=True,
        logging_dir="./logs",
        logging_strategy="steps",
        logging_steps=50,
        save_total_limit=2,
    )

    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        eval_dataset=tokenized_dataset["validation"],
        tokenizer=tokenizer,
        data_collator=data_collator,
    )

    logger.info("Starting training...")
    trainer.train()

    logger.info("Saving model...")
    trainer.save_model(args.output_dir)

    logger.info("Evaluating on test set...")
    metrics = trainer.evaluate(tokenized_dataset["test"])
    logger.info(metrics)


if __name__ == "__main__":
    main()
