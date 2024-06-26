import { t } from "@lingui/macro";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  CircleNotch,
  ClockClockwise,
  CubeFocus,
  FilePdf,
  Hash,
  LineSegment,
  LinkSimple,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  StarHalf,
  Translate,
} from "@phosphor-icons/react";
import { Button, Separator, Toggle, Tooltip } from "@reactive-resume/ui";
import { motion } from "framer-motion";

import { useToast } from "@/client/hooks/use-toast";
import { usePrintResume } from "@/client/services/resume";
import { useAiOptimizeResume, useAiTranslate } from "@/client/services/resume/openai";
import { useBuilderStore } from "@/client/stores/builder";
import { useResumeStore, useTemporalResumeStore } from "@/client/stores/resume";

const openInNewTab = (url: string) => {
  const win = window.open(url, "_blank");
  if (win) win.focus();
};

export const BuilderToolbar = () => {
  const { toast } = useToast();
  const setValue = useResumeStore((state) => state.setValue);
  const updateResumeData = useResumeStore((state) => state.updateResumeData);
  const undo = useTemporalResumeStore((state) => state.undo);
  const redo = useTemporalResumeStore((state) => state.redo);
  const frameRef = useBuilderStore((state) => state.frame.ref);

  const { resume } = useResumeStore.getState();
  const id = useResumeStore((state) => state.resume.id);
  const isPublic = useResumeStore((state) => state.resume.visibility === "public");
  const pageOptions = useResumeStore((state) => state.resume.data.metadata.page.options);

  const { printResume, loading: isPrinting } = usePrintResume();
  const { translateResume, loading: isTranslating } = useAiTranslate();
  const { optimizeResume, loading: isOptimizing } = useAiOptimizeResume();

  const onPrint = async () => {
    const { url } = await printResume({ id });

    openInNewTab(url);
  };

  const onTranslate = async () => {
    const resumeJSON = resume.data;
    const newResumeJSON = await translateResume(resumeJSON);
    updateResumeData(newResumeJSON);
    console.log(newResumeJSON, "newResumeJSON");
  };

  const onOptimizeResume = async () => {
    const resumeJSON = resume.data;
    console.log(resumeJSON);
    const newResumeJSON = await optimizeResume(resumeJSON);
    updateResumeData(newResumeJSON);
    console.log(newResumeJSON, "newResumeJSON");
  };

  const onCopy = async () => {
    const { url } = await printResume({ id });
    await navigator.clipboard.writeText(url);

    toast({
      variant: "success",
      title: t`A link has been copied to your clipboard.`,
      description: t`Anyone with this link can view and download the resume. Share it on your profile or with recruiters.`,
    });
  };

  const onZoomIn = () => frameRef?.contentWindow?.postMessage({ type: "ZOOM_IN" }, "*");
  const onZoomOut = () => frameRef?.contentWindow?.postMessage({ type: "ZOOM_OUT" }, "*");
  const onResetView = () => frameRef?.contentWindow?.postMessage({ type: "RESET_VIEW" }, "*");
  const onCenterView = () => frameRef?.contentWindow?.postMessage({ type: "CENTER_VIEW" }, "*");

  return (
    <motion.div className="fixed inset-x-0 bottom-0 mx-auto hidden py-6 text-center md:block">
      <div className="inline-flex items-center justify-center rounded-full bg-background px-4 shadow-xl">
        <Tooltip content={t`Undo`}>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-none"
            onClick={() => {
              undo();
            }}
          >
            <ArrowCounterClockwise />
          </Button>
        </Tooltip>

        <Tooltip content={t`Redo`}>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-none"
            onClick={() => {
              redo();
            }}
          >
            <ArrowClockwise />
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" />

        <Tooltip content={t`Zoom In`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onZoomIn}>
            <MagnifyingGlassPlus />
          </Button>
        </Tooltip>

        <Tooltip content={t`Zoom Out`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onZoomOut}>
            <MagnifyingGlassMinus />
          </Button>
        </Tooltip>

        <Tooltip content={t`Reset Zoom`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onResetView}>
            <ClockClockwise />
          </Button>
        </Tooltip>

        <Tooltip content={t`Center Artboard`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onCenterView}>
            <CubeFocus />
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" />

        <Tooltip content={t`Toggle Page Break Line`}>
          <Toggle
            className="rounded-none"
            pressed={pageOptions.breakLine}
            onPressedChange={(pressed) => {
              setValue("metadata.page.options.breakLine", pressed);
            }}
          >
            <LineSegment />
          </Toggle>
        </Tooltip>

        <Tooltip content={t`Toggle Page Numbers`}>
          <Toggle
            className="rounded-none"
            pressed={pageOptions.pageNumbers}
            onPressedChange={(pressed) => {
              setValue("metadata.page.options.pageNumbers", pressed);
            }}
          >
            <Hash />
          </Toggle>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" />

        <Tooltip content={t`Copy online resume links`}>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-none"
            disabled={!isPublic}
            onClick={onCopy}
          >
            <LinkSimple />
          </Button>
        </Tooltip>

        <Tooltip content={t`Download PDF`}>
          <Button
            size="icon"
            variant="ghost"
            disabled={isPrinting}
            className="rounded-none"
            onClick={onPrint}
          >
            {isPrinting ? <CircleNotch className="animate-spin" /> : <FilePdf />}
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" />

        <Tooltip content={t`Translate Resume`}>
          <Button
            size="icon"
            variant="ghost"
            disabled={isTranslating}
            className="rounded-none"
            onClick={onTranslate}
          >
            {isTranslating ? <CircleNotch className="animate-spin" /> : <Translate />}
          </Button>
        </Tooltip>

        <Tooltip content={t`AI to modify Resume`}>
          <Button
            size="icon"
            variant="ghost"
            disabled={isOptimizing}
            className="rounded-none"
            onClick={onOptimizeResume}
          >
            {isOptimizing ? <StarHalf className="animate-spin" /> : <StarHalf />}
          </Button>
        </Tooltip>
      </div>
    </motion.div>
  );
};
